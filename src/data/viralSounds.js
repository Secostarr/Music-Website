/**
 * Kontrak data musik terpadu (UnifiedTrack) dan fondasi curated viral sounds.
 *
 * Persyaratan saat menambahkan sound baru ke curatedViralSounds:
 * 1. audioUrl harus berupa tautan audio yang sah, berlisensi, atau bebas royalti / Creative Commons.
 * 2. Jangan menyalin lirik lengkap atau karya berhak cipta tanpa izin tertulis.
 * 3. Attribution wajib diisi untuk menyebut pencipta/sumber resmi.
 * 4. segmentStart dan segmentEnd harus divalidasi tidak melebihi durasi audio aktual.
 * 5. Track kurasi wajib memiliki legalMeta yang lolos validasi dengan status "verified".
 * 6. permissionScope dan evidenceType wajib sesuai kebutuhan penggunaan aplikasi.
 * 7. Jika audio di-host sendiri oleh aplikasi (isProjectHosted === true), scope 'hosting' mutlak wajib.
 * 8. Jika izin memiliki batas waktu (expiresAt), izin yang telah lewat tanggal UTC otomatis kedaluwarsa.
 */

/**
 * @typedef {"CC0-1.0" | "CC-BY-4.0" | "CC-BY-SA-4.0" | "CC-BY-NC-4.0" | "Direct-Permission" | "Public-Domain"} AllowedLicenseType
 */

/**
 * @typedef {"verified" | "pending" | "rejected"} AllowedVerificationStatus
 */

/**
 * @typedef {"self-created" | "written-permission"} AllowedEvidenceType
 */

/**
 * @typedef {"streaming" | "hosting" | "segment-editing" | "website-distribution" | "commercial-use"} AllowedPermissionScope
 */

/**
 * @typedef {Object} LegalMeta
 * @property {AllowedLicenseType} licenseType - Jenis lisensi resmi yang terverifikasi
 * @property {string} licenseUrl - URL dokumen/teks lisensi resmi (wajib HTTPS)
 * @property {string} attributionText - Teks atribusi lengkap yang diwajibkan oleh pemberi lisensi
 * @property {string} creatorUrl - URL ke portofolio/profil resmi kreator (wajib HTTPS)
 * @property {AllowedVerificationStatus} verificationStatus - Status verifikasi kurasi
 * @property {AllowedEvidenceType} evidenceType - Jenis bukti izin/kepemilikan
 * @property {string} evidenceReference - Referensi publik aman (URL HTTPS) atau penanda verifikasi privat internal ("internal-private-record:...")
 * @property {AllowedPermissionScope[]} permissionScope - Daftar cakupan izin yang disetujui
 * @property {boolean} isProjectHosted - Deklarasi eksplisit apakah audio di-host sendiri oleh proyek (true: hosting wajib, false: external audio)
 * @property {boolean} [isRevoked] - Penanda jika izin dicabut secara eksplisit (default false)
 * @property {string} [expiresAt] - Tanggal kedaluwarsa izin (format YYYY-MM-DD UTC)
 * @property {string} [verifiedAt] - Tanggal verifikasi (format YYYY-MM-DD UTC)
 * @property {string} [verifierNotes] - Catatan bukti verifikasi atau nomor referensi izin
 */

/**
 * Daftar kategori/mood resmi untuk pengelompokan kurasi katalog Reff Viral.
 * Kategori ini murni sebagai metadata navigasi/filtering UI, bukan bukti legalitas audio.
 */
export const ALLOWED_VIRAL_CATEGORIES = Object.freeze([
  "Galau",
  "Sad",
  "Romantic",
  "Funny",
  "Anime",
  "Speed Up",
]);

/**
 * Memvalidasi apakah kategori yang diberikan termasuk dalam daftar kategori resmi.
 *
 * @param {any} category
 * @returns {boolean}
 */
export function isValidViralCategory(category) {
  return typeof category === "string" && ALLOWED_VIRAL_CATEGORIES.includes(category);
}

/**
 * @typedef {"Galau" | "Sad" | "Romantic" | "Funny" | "Anime" | "Speed Up"} AllowedViralCategory
 */

/**
 * @typedef {Object} ViralMeta
 * @property {string} [quote] - Kutipan kata/hook pendek orisinal atau berizin untuk video/reels
 * @property {string} [trendTag] - Tag tren/kategori (misal: "Galau", "Speed Up", "Senja")
 * @property {AllowedViralCategory} [category] - Kategori mood resmi untuk navigasi katalog
 */

/**
 * @typedef {Object} UnifiedTrack
 * @property {string} id - Identifier unik dengan prefix sumber (contoh: "curated-001" atau "dz-12345")
 * @property {"deezer"|"curated"} source - Sumber data audio
 * @property {"preview"|"segment"|"full"} type - Jenis audio yang dapat diputar
 * @property {string} title - Judul lagu atau nama sound
 * @property {string} artist - Nama pencipta, musisi, atau kreator
 * @property {string} artwork - URL gambar thumbnail/cover
 * @property {string} audioUrl - URL audio yang dapat diputar
 * @property {number} duration - Durasi audio sumber yang terverifikasi (detik)
 * @property {number} previewDuration - Durasi audio preview atau segmen yang tersedia (detik)
 * @property {number} segmentStart - Waktu awal segmen (detik, default 0)
 * @property {number} segmentEnd - Waktu akhir segmen (detik)
 * @property {boolean} isLoopable - Penanda apakah sound default berulang
 * @property {string} attribution - Kredit atribusi / lisensi resmi
 * @property {string} sourceUrl - Tautan ke halaman sumber resmi
 * @property {LegalMeta} [legalMeta] - Metadata legal kurasi (wajib untuk track curated)
 * @property {ViralMeta} [viralMeta] - Metadata opsional untuk kebutuhan konten viral
 * @property {string} [previewUrl] - Alias audioUrl untuk kompatibilitas ke belakang
 * @property {string} [album] - Judul album (opsional)
 * @property {string} [link] - Tautan eksternal (opsional)
 */

/**
 * Dataset curated viral sounds.
 * Saat ini dikosongkan terlebih dahulu sampai sumber audio yang terverifikasi legal tersedia.
 * @type {UnifiedTrack[]}
 */
export const curatedViralSounds = [];

/**
 * Konfigurasi model produk WEB MUSIC saat ini.
 * Jika `isCommercialProduct` disetel ke true, izin `commercial-use` diwajibkan untuk setiap track curated.
 */
export const PRODUCT_LEGAL_CONFIG = Object.freeze({
  isCommercialProduct: false, // Disetel false untuk aplikasi showcase portofolio / non-komersial
});

/**
 * Daftar lisensi legal yang diizinkan untuk materi kurasi.
 */
export const ALLOWED_LICENSE_TYPES = Object.freeze([
  "CC0-1.0",
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "CC-BY-NC-4.0",
  "Direct-Permission",
  "Public-Domain",
]);

/**
 * Daftar status verifikasi kurasi yang diizinkan.
 */
export const ALLOWED_VERIFICATION_STATUSES = Object.freeze([
  "verified",
  "pending",
  "rejected",
]);

/**
 * Daftar tipe bukti izin yang diizinkan.
 */
export const ALLOWED_EVIDENCE_TYPES = Object.freeze([
  "self-created",
  "written-permission",
]);

/**
 * Daftar cakupan izin yang dikenali.
 */
export const ALLOWED_PERMISSION_SCOPES = Object.freeze([
  "streaming",
  "hosting",
  "segment-editing",
  "website-distribution",
  "commercial-use",
]);

/**
 * Cakupan izin minimum yang mutlak diperlukan untuk pemutaran fitur Reff Viral.
 */
export const REQUIRED_CORE_SCOPES = Object.freeze([
  "streaming",
  "segment-editing",
  "website-distribution",
]);

/**
 * Memvalidasi apakah string merupakan URL HTTPS yang sah.
 *
 * @param {any} urlString
 * @returns {boolean}
 */
export function isValidHttpsUrl(urlString) {
  if (typeof urlString !== "string" || !urlString.trim()) return false;
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Memeriksa apakah string tanggal memiliki format YYYY-MM-DD dan valid menurut kalender riil (UTC).
 *
 * @param {any} dateStr
 * @returns {boolean}
 */
export function isValidCalendarDate(dateStr) {
  if (typeof dateStr !== "string") return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Validasi jumlah hari aktual dalam bulan tersebut menggunakan UTC
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  );
}

/**
 * Memeriksa apakah tanggal ISO YYYY-MM-DD sudah lewat terhadap tanggal UTC hari ini.
 * Membandingkan secara leksikografis (YYYY-MM-DD) berbasis UTC agar deterministik dan independen dari timezone lokal mesin.
 *
 * @param {string} dateStr - Tanggal berformat YYYY-MM-DD
 * @param {Date} [currentDateInstance] - Instance Date opsional untuk keperluan testing
 * @returns {boolean} - true jika tanggal telah kedaluwarsa (di masa lalu)
 */
export function isDateExpiredUtc(dateStr, currentDateInstance = new Date()) {
  if (!isValidCalendarDate(dateStr)) return true;

  const currentYear = currentDateInstance.getUTCFullYear();
  const currentMonth = String(currentDateInstance.getUTCMonth() + 1).padStart(2, "0");
  const currentDay = String(currentDateInstance.getUTCDate()).padStart(2, "0");
  const todayUtcStr = `${currentYear}-${currentMonth}-${currentDay}`;

  // Jika dateStr lebih kecil dari todayUtcStr, berarti tanggal telah lewat
  return dateStr < todayUtcStr;
}

/**
 * Memeriksa apakah string referensi bukti aman dan valid.
 * - Untuk bukti publik: wajib berupa URL HTTPS valid.
 * - Untuk bukti privat internal: wajib berawalan identifier khusus `internal-private-record:` (bebas data PII).
 * - Menolak teks yang mengandung pola data pribadi sensitif (email atau nomor telepon mentah).
 * Catatan: Validator regex ini adalah pengaman otomatis baris pertama; verifikasi manual kurator tetap mutlak wajib.
 *
 * @param {any} ref
 * @returns {boolean}
 */
export function isValidEvidenceReference(ref) {
  if (typeof ref !== "string" || !ref.trim()) return false;
  const trimmed = ref.trim();

  // Tipe 1: URL HTTPS publik
  // URL HTTPS yang sah diperiksa terlebih dahulu. Path URL tidak boleh memuat format alamat email.
  if (isValidHttpsUrl(trimmed)) {
    const rawEmailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    if (rawEmailPattern.test(trimmed)) {
      return false;
    }
    return true;
  }

  // Tipe 2: Penanda rekam jejak internal privat tanpa membocorkan PII
  if (
    trimmed.startsWith("internal-private-record:") &&
    trimmed.length > "internal-private-record:".length + 3
  ) {
    const rawEmailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    // Mendeteksi pola nomor telepon lokal maupun internasional (+xx, tanda kurung, atau deretan 8-15 digit)
    const phonePattern = /(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4,9}|\b\+?[0-9]{8,15}\b/;
    if (rawEmailPattern.test(trimmed) || phonePattern.test(trimmed)) {
      return false;
    }
    return true;
  }

  return false;
}

/**
 * Memvalidasi kepatuhan objek LegalMeta terhadap standar legal kurasi, cakupan izin, dan masa berlaku.
 *
 * @param {any} meta - Objek metadata legal yang akan divalidasi
 * @param {Date} [currentDateInstance] - Instance Date untuk penentuan batas tanggal kedaluwarsa UTC
 * @returns {boolean}
 */
export function isValidLegalMeta(meta, currentDateInstance = new Date()) {
  if (!meta || typeof meta !== "object") return false;

  // 1. Validasi enum licenseType
  if (!ALLOWED_LICENSE_TYPES.includes(meta.licenseType)) {
    return false;
  }

  // 2. Validasi enum verificationStatus
  if (!ALLOWED_VERIFICATION_STATUSES.includes(meta.verificationStatus)) {
    return false;
  }

  // 3. Validasi URL lisensi dan profil kreator (wajib HTTPS)
  if (!isValidHttpsUrl(meta.licenseUrl) || !isValidHttpsUrl(meta.creatorUrl)) {
    return false;
  }

  // 4. Validasi teks atribusi
  if (
    typeof meta.attributionText !== "string" ||
    meta.attributionText.trim().length === 0
  ) {
    return false;
  }

  // 5. Validasi tipe bukti izin (evidenceType)
  if (!ALLOWED_EVIDENCE_TYPES.includes(meta.evidenceType)) {
    return false;
  }

  // 6. Validasi referensi bukti izin (evidenceReference)
  if (!isValidEvidenceReference(meta.evidenceReference)) {
    return false;
  }

  // 7. Validasi cakupan izin (permissionScope)
  if (!Array.isArray(meta.permissionScope) || meta.permissionScope.length === 0) {
    return false;
  }

  // Setiap item scope harus valid
  for (const scope of meta.permissionScope) {
    if (!ALLOWED_PERMISSION_SCOPES.includes(scope)) {
      return false;
    }
  }

  // Wajib memenuhi seluruh cakupan minimum fitur Reff Viral
  for (const requiredScope of REQUIRED_CORE_SCOPES) {
    if (!meta.permissionScope.includes(requiredScope)) {
      return false;
    }
  }

  // 8. Validasi deklarasi eksplisit isProjectHosted (wajib boolean sejati)
  if (typeof meta.isProjectHosted !== "boolean") {
    return false;
  }

  // Jika audio di-host sendiri oleh proyek (isProjectHosted === true), scope 'hosting' mutlak wajib
  if (meta.isProjectHosted === true && !meta.permissionScope.includes("hosting")) {
    return false;
  }

  // Jika produk dikonfigurasi sebagai komersial, izin commercial-use mutlak wajib ada
  if (PRODUCT_LEGAL_CONFIG.isCommercialProduct && !meta.permissionScope.includes("commercial-use")) {
    return false;
  }

  // 9. Validasi status pencabutan izin (isRevoked)
  if (meta.isRevoked === true) {
    return false;
  }

  // 10. Validasi masa berlaku izin (expiresAt)
  if (meta.expiresAt !== undefined && meta.expiresAt !== null) {
    if (!isValidCalendarDate(meta.expiresAt)) {
      return false;
    }
    // Jika tanggal kedaluwarsa sudah lewat terhadap waktu UTC saat ini, izin ditolak
    if (isDateExpiredUtc(meta.expiresAt, currentDateInstance)) {
      return false;
    }
  }

  // 11. Validasi verifiedAt opsional (jika diisi harus tanggal kalender valid YYYY-MM-DD)
  if (meta.verifiedAt !== undefined && meta.verifiedAt !== null) {
    if (!isValidCalendarDate(meta.verifiedAt)) {
      return false;
    }
  }

  // 12. Validasi verifierNotes opsional
  if (meta.verifierNotes !== undefined && meta.verifierNotes !== null) {
    if (typeof meta.verifierNotes !== "string") {
      return false;
    }
  }

  return true;
}

/**
 * Memvalidasi apakah sebuah objek mematuhi kontrak UnifiedTrack.
 * - Track Deezer divalidasi dengan struktur data kompatibilitas lama.
 * - Track Curated wajib memiliki legalMeta yang valid dengan status "verified".
 *
 * @param {any} track - Objek yang akan divalidasi
 * @param {Date} [currentDateInstance] - Instance Date untuk penentuan batas tanggal kedaluwarsa UTC
 * @returns {boolean}
 */
export function isValidUnifiedTrack(track, currentDateInstance = new Date()) {
  if (!track || typeof track !== "object") return false;

  const hasRequiredFields =
    typeof track.id === "string" &&
    track.id.trim().length > 0 &&
    (track.source === "deezer" || track.source === "curated") &&
    (track.type === "preview" || track.type === "segment" || track.type === "full") &&
    typeof track.title === "string" &&
    typeof track.artist === "string" &&
    typeof track.audioUrl === "string" &&
    typeof track.duration === "number" &&
    typeof track.previewDuration === "number" &&
    typeof track.segmentStart === "number" &&
    typeof track.segmentEnd === "number" &&
    typeof track.isLoopable === "boolean";

  if (!hasRequiredFields) return false;

  // Validasi batas rentang waktu dasar
  const isTimeRangeValid =
    Number.isFinite(track.segmentStart) &&
    Number.isFinite(track.segmentEnd) &&
    Number.isFinite(track.previewDuration) &&
    Number.isFinite(track.duration) &&
    track.segmentStart >= 0 &&
    track.segmentEnd >= track.segmentStart &&
    track.previewDuration >= 0 &&
    track.duration >= 0;

  if (!isTimeRangeValid) return false;

  // Aturan kepatuhan khusus track curated:
  // Wajib memiliki legalMeta yang valid dengan verificationStatus === "verified"
  if (track.source === "curated") {
    if (!isValidLegalMeta(track.legalMeta, currentDateInstance)) {
      return false;
    }

    if (track.legalMeta.verificationStatus !== "verified") {
      return false;
    }

    // Validasi viralMeta opsional jika disertakan
    if (track.viralMeta !== undefined && track.viralMeta !== null) {
      if (typeof track.viralMeta !== "object") {
        return false;
      }
      if (
        track.viralMeta.category !== undefined &&
        track.viralMeta.category !== null &&
        !isValidViralCategory(track.viralMeta.category)
      ) {
        return false;
      }
      if (
        track.viralMeta.quote !== undefined &&
        track.viralMeta.quote !== null &&
        typeof track.viralMeta.quote !== "string"
      ) {
        return false;
      }
      if (
        track.viralMeta.trendTag !== undefined &&
        track.viralMeta.trendTag !== null &&
        typeof track.viralMeta.trendTag !== "string"
      ) {
        return false;
      }
    }
  }

  return true;
}
