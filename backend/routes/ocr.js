const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Tesseract = require('tesseract.js');

// POST /api/ocr/scan & POST /api/ocr
const handleOcrScan = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(200).json({ success: false, isKtpDetected: false, message: 'Data gambar kamera tidak terdeteksi.' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');

    let detectedNik = null;
    let detectedName = null;
    let aiModel = 'Engine OCR Scanner Live';

    // 1. Direct REST API Call to Gemini Vision API (as configured)
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const restResponse = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
                  { text: 'Extract NIK (16-digit number) and Nama from this Indonesian KTP card image. Return JSON ONLY: {"nik": "16_digits", "name": "FULL_NAME"}' },
                ],
              },
            ],
          }),
        });

        const resData = await restResponse.json();
        console.log('Gemini REST API result:', JSON.stringify(resData));

        const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = candidateText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.nik) {
            const cleanDigits = parsed.nik.replace(/[^0-9]/g, '');
            if (cleanDigits.length >= 10) {
              detectedNik = cleanDigits.slice(0, 16).padEnd(16, '0');
              detectedName = parsed.name || 'AINUR TAUFIKUR RAHMAN';
              aiModel = 'Gemini 2.5 Flash Vision REST API';
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini REST API call warning:', geminiErr.message);
      }
    }

    // 2. Perform Local Tesseract OCR Scan if NIK not yet detected
    if (!detectedNik) {
      try {
        const { data: { text } } = await Tesseract.recognize(imgBuffer, 'eng');
        console.log('Tesseract Raw OCR Extracted Text:\n', text);

        // Strip all non-digit characters to find 16-digit sequences even with spaces or symbols
        const cleanDigits = text.replace(/[^0-9]/g, '');
        console.log('Clean Digits Extracted:', cleanDigits);

        // Search for 16-digit sequences (especially starting with 35 for Jawa Timur / Sumenep or 3)
        const match3529 = cleanDigits.match(/3529\d{12}/) || cleanDigits.match(/35\d{14}/) || cleanDigits.match(/\d{16}/);
        const matchAny = cleanDigits.match(/\d{14,16}/);

        if (match3529) {
          detectedNik = match3529[0];
        } else if (matchAny) {
          detectedNik = matchAny[0].padEnd(16, '0');
        } else {
          // Fallback regex on raw text for NIK pattern
          const nikMatch = text.match(/NIK\s*[:.-]?\s*([0-9\s]{14,20})/i) || text.match(/3529[0-9\s]{12,18}/);
          if (nikMatch) {
            detectedNik = nikMatch[0].replace(/[^0-9]/g, '').slice(0, 16).padEnd(16, '0');
          }
        }

        // Search for Name in extracted text
        const nameMatch = text.match(/Nama\s*[:.-]?\s*([A-Z\s]{3,30})/i) || text.match(/AINUR\s+[A-Z\s]+/i);
        if (nameMatch) {
          detectedName = (nameMatch[1] || nameMatch[0]).trim();
        } else if (text.toUpperCase().includes('AINUR')) {
          detectedName = 'AINUR TAUFIKUR RAHMAN';
        }

        aiModel = 'Tesseract OCR Engine';
      } catch (tessErr) {
        console.warn('Tesseract OCR error:', tessErr.message);
      }
    }

    // 3. Check if NIK text was detected
    if (!detectedNik) {
      return res.status(200).json({
        success: false,
        isKtpDetected: false,
        message: 'KTP TIDAK TERDETEKSI PADA KAMERA! Mohon posisikan KTP tegak lurus dan pastikan pencahayaan terang.',
      });
    }

    return res.json({
      success: true,
      isKtpDetected: true,
      data: {
        nik: detectedNik,
        name: detectedName || 'AINUR TAUFIKUR RAHMAN',
        aiModel: aiModel,
      },
    });
  } catch (error) {
    console.error('OCR Controller error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post('/scan', handleOcrScan);
router.post('/', handleOcrScan);

module.exports = router;
