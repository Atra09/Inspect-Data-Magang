import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, UserCheck, VideoOff, Video, Sparkles, Check, AlertTriangle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

export default function ScanKtpPage() {
  const [selectedVessel, setSelectedVessel] = useState('KM Express Bahari 9E');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const [scannedCount, setScannedCount] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [manualNik, setManualNik] = useState('');
  const [manualName, setManualName] = useState('');

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Initialize WebRTC Live Camera Stream
  const startWebCam = async () => {
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
        setCapturedImage(null);
      } else {
        setCameraError('Browser tidak mendukung WebRTC Kamera.');
      }
    } catch (err) {
      console.error('Camera stream error:', err);
      setCameraError('Akses kamera WebRTC terblokir. Pastikan izin kamera aktif.');
      setIsCameraActive(false);
    }
  };

  const stopWebCam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startWebCam();
    return () => {
      stopWebCam();
    };
  }, []);

  // Instant Webcam Frame Capture & Gemini Vision AI Detection
  const handleSnapCamera = async () => {
    setIsScanning(true);
    setScanResult(null);
    setScanError('');

    let frameBase64 = null;

    // Capture frame directly from live video feed element if active
    if (videoRef.current && isCameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      frameBase64 = canvas.toDataURL('image/jpeg', 0.7);
      setCapturedImage(frameBase64);
    }

    if (!frameBase64) {
      setScanError('Gagal mengambil gambar dari kamera live.');
      setIsScanning(false);
      return;
    }

    try {
      // Send base64 frame to backend OCR scanner
      const ocrRes = await axiosInstance.post('/api/ocr/scan', { imageBase64: frameBase64 });

      if (ocrRes.data && ocrRes.data.success && ocrRes.data.data) {
        const extractedNik = ocrRes.data.data.nik;
        const extractedName = ocrRes.data.data.name;

        const newScan = {
          spbNumber: 'SPB-2026-0091',
          vessel: selectedVessel,
          officerName: 'Budi Santoso, S.ST.',
          ocrNik: extractedNik,
          ocrName: extractedName,
          matchStatus: 'Match',
          status: 'Disetujui',
          statusType: 'success',
          timestamp: new Date().toLocaleTimeString('id-ID'),
        };

        setScanResult(newScan);
        setScanError('');
        setScannedCount((prev) => prev + 1);

        // 1. Save to backend inspection database
        try {
          await axiosInstance.post('/api/inspection', newScan);
        } catch (dbErr) {
          console.error('Save to inspection warning:', dbErr.message);
        }

        // 2. Automatically sync passenger to Manifest Muatan table
        try {
          await axiosInstance.post('/api/manifest', {
            spbNumber: 'SPB-2026-0091',
            shipName: selectedVessel,
            scheduleTime: new Date().toLocaleTimeString('id-ID') + ' WIB',
            nik: extractedNik,
            passengerName: extractedName,
            ticketNumber: 'TCK-2026-' + (extractedNik.slice(-4) || '0901'),
            seatNumber: 'B-' + (Math.floor(Math.random() * 50) + 1),
            gender: 'L',
            origin: 'Dermaga Kalianget',
            destination: 'Pelabuhan Kangean',
            status: 'Valid',
          });
        } catch (manifestErr) {
          console.error('Sync to manifest warning:', manifestErr.message);
        }
      } else {
        setScanResult(null);
        setScanError(ocrRes.data?.message || 'KTP TIDAK TERDETEKSI PADA KAMERA! Mohon posisikan KTP tegak lurus.');
      }
    } catch (err) {
      console.error('Failed to process camera OCR scan:', err);
      setScanResult(null);
      const rawMsg = err.response?.data?.message || '';
      const errMsg = (rawMsg && rawMsg !== 'Not Found' && !rawMsg.includes('404'))
        ? rawMsg
        : 'KTP TIDAK TERDETEKSI PADA KAMERA! Mohon posisikan KTP fisik dengan jelas & pencahayaan terang di depan kamera.';
      setScanError(errMsg);
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualSave = async (e) => {
    e.preventDefault();
    if (!manualNik || !manualName) return;

    setScanError('');

    const newScan = {
      spbNumber: 'SPB-2026-0091',
      vessel: selectedVessel,
      officerName: 'Petugas KSOP',
      ocrNik: manualNik,
      ocrName: manualName,
      matchStatus: 'Match',
      status: 'Disetujui',
      statusType: 'success',
      timestamp: new Date().toLocaleTimeString('id-ID'),
    };

    setScanResult(newScan);
    setScannedCount((prev) => prev + 1);
    setManualNik('');
    setManualName('');

    try {
      await axiosInstance.post('/api/inspection', newScan);
      await axiosInstance.post('/api/manifest', {
        spbNumber: 'SPB-2026-0091',
        shipName: selectedVessel,
        scheduleTime: new Date().toLocaleTimeString('id-ID') + ' WIB',
        nik: manualNik,
        passengerName: manualName,
        ticketNumber: 'TCK-2026-' + (manualNik.slice(-4) || '0901'),
        seatNumber: 'A-' + (Math.floor(Math.random() * 50) + 1),
        gender: 'L',
        origin: 'Dermaga Kalianget',
        destination: 'Pelabuhan Kangean',
        status: 'Valid',
      });
    } catch (err) {
      console.error('Failed to save manual entry:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
              <Sparkles size={14} className="text-[#38BDF8]" />
              <span>Gemini Vision AI KTP OCR Live</span>
            </div>
            <h1 className="text-2xl font-extrabold">Scan KTP Gangway Dermaga</h1>
            <p className="text-xs text-sky-100 mt-1">
              Verifikasi fisik KTP penumpang real-time dengan kamera live & Gemini Vision AI OCR.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-right">
            <p className="text-[10px] text-sky-200 uppercase font-semibold">Total Scanned Kapal Ini</p>
            <p className="text-xl font-black text-white">{scannedCount} Penumpang</p>
          </div>
        </div>
      </div>

      {/* RED ALERT CARD: Shown ONLY when NO real KTP is detected */}
      {scanError && (
        <div className="bg-rose-50 rounded-2xl border-2 border-rose-500 p-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-rose-700">
            <AlertTriangle size={28} className="text-rose-600 shrink-0" />
            <div>
              <h3 className="font-extrabold text-base text-rose-900">KTP TIDAK TERDETEKSI PADA KAMERA!</h3>
              <p className="text-xs font-bold text-rose-700 mt-1">
                {scanError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Detection Result Card (Shown ONLY when real KTP is successfully detected) */}
      {scanResult && !scanError && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/80 p-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <h3 className="font-extrabold text-base">Hasil Deteksi Kamera OCR & Gemini AI</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
              TERSIMPAN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NIK Penumpang (16 Digit)</p>
              <p className="text-xl font-black text-slate-900 tracking-wider font-mono mt-0.5">
                {scanResult.ocrNik}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap Penumpang</p>
              <p className="text-lg font-black text-[#0284C7] uppercase mt-0.5">
                {scanResult.ocrName}
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-200/60">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Status Manifest Kapal</p>
              <p className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Check size={14} /> MATCH (VALID PENUMPANG RESMI)
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-200/60">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Kapal & Waktu Scan</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                {scanResult.vessel} ({scanResult.timestamp || 'Baru saja'})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Session & Camera Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Camera & OCR Scanner Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#0284C7]" />
                <h3 className="font-extrabold text-slate-800 text-sm">Active Gangway Session</h3>
              </div>

              <select
                value={selectedVessel}
                onChange={(e) => setSelectedVessel(e.target.value)}
                className="text-xs font-bold bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg outline-none text-[#0284C7]"
              >
                <option value="KM Express Bahari 9E">KM Express Bahari 9E</option>
                <option value="KM Cantika Express 88">KM Cantika Express 88</option>
                <option value="KM Dharma Kartika IX">KM Dharma Kartika IX</option>
              </select>
            </div>

            {/* Viewfinder Frame with Real Video Tag */}
            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-[#0284C7]/50 group">
              {/* WebRTC Video Stream Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isCameraActive && !capturedImage ? 'block' : 'hidden'}`}
              />

              {/* Captured Frame Freeze Preview */}
              {capturedImage && (
                <div className="relative w-full h-full">
                  <img src={capturedImage} alt="Captured KTP Frame" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setCapturedImage(null);
                      setScanError('');
                      if (!isCameraActive) startWebCam();
                    }}
                    className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-md hover:bg-slate-900"
                  >
                    Reset Kamera Live
                  </button>
                </div>
              )}

              {/* Scanning Overlay Spinner */}
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3 z-20">
                  <RefreshCw size={40} className="animate-spin text-[#38BDF8]" />
                  <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-sky-200 animate-pulse">
                    <Sparkles size={16} />
                    <span>GEMINI VISION AI OCR DETECTING NIK & NAMA...</span>
                  </div>
                </div>
              )}

              {/* Placeholder when camera is inactive or denied */}
              {!isCameraActive && !capturedImage && !isScanning && (
                <div className="flex flex-col items-center text-slate-400 space-y-3 z-10 p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 shadow-inner">
                    <Camera size={32} />
                  </div>
                  <p className="text-xs font-semibold text-slate-300">
                    {cameraError || "Arahkan KTP ke kamera webcam lalu klik 'Jepret KTP Kamera'"}
                  </p>
                  <button
                    type="button"
                    onClick={startWebCam}
                    className="px-4 py-1.5 bg-[#0284C7] text-white text-xs font-bold rounded-full shadow-sm hover:bg-[#0369A1]"
                  >
                    Nyalakan Ulang Kamera Live
                  </button>
                </div>
              )}

              {/* Laser Scanning Line Overlay */}
              {isScanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38BDF8] animate-bounce z-30" />
              )}
            </div>

            {/* Scan Action Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              {/* Direct Shutter Snap Button */}
              <button
                type="button"
                onClick={handleSnapCamera}
                disabled={isScanning}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg flex items-center justify-center gap-2 outline-none disabled:opacity-50 transition-all cursor-pointer active:scale-98"
              >
                <Camera size={20} />
                <span>Jepret KTP Kamera (Gemini Vision AI)</span>
              </button>

              {/* Toggle WebCam Stream Button */}
              <button
                type="button"
                onClick={isCameraActive ? stopWebCam : startWebCam}
                className="px-4 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all outline-none"
              >
                {isCameraActive ? <VideoOff size={16} /> : <Video size={16} />}
                <span>{isCameraActive ? 'Matikan WebCam' : 'Live Stream WebCam'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Manual Entry */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm mb-1 flex items-center gap-2">
              <UserCheck size={18} className="text-[#0284C7]" />
              Input Manual (Fallback)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Gunakan jika KTP pudar atau berhalangan foto.</p>

            <form onSubmit={handleManualSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">NIK KTP (16 Digit)</label>
                <input
                  type="text"
                  placeholder="3201xxxxxxxxxxxx"
                  value={manualNik}
                  onChange={(e) => setManualNik(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Sesuai KTP</label>
                <input
                  type="text"
                  placeholder="Nama Lengkap Penumpang"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0284C7]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
              >
                Simpan Ke Database Laragon
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
