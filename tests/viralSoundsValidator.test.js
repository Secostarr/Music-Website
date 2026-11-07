import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isValidHttpsUrl,
  isValidCalendarDate,
  isDateExpiredUtc,
  isValidEvidenceReference,
  isValidLegalMeta,
  isValidUnifiedTrack,
  isValidViralCategory,
  ALLOWED_VIRAL_CATEGORIES,
  curatedViralSounds,
} from "../src/data/viralSounds.js";
import { toUnifiedTrack } from "../src/services/musicApi.js";

describe("1. Audit Helper URL HTTPS", () => {
  it("menerima URL HTTPS yang sah", () => {
    assert.equal(isValidHttpsUrl("https://creativecommons.org/licenses/by/4.0/"), true);
    assert.equal(isValidHttpsUrl("https://example.com/artist/profile"), true);
  });

  it("menolak URL non-HTTPS atau malformed", () => {
    assert.equal(isValidHttpsUrl("http://example.com/insecure"), false);
    assert.equal(isValidHttpsUrl("ftp://example.com/file"), false);
    assert.equal(isValidHttpsUrl("javascript:alert(1)"), false);
    assert.equal(isValidHttpsUrl(""), false);
    assert.equal(isValidHttpsUrl("   "), false);
    assert.equal(isValidHttpsUrl(null), false);
    assert.equal(isValidHttpsUrl(undefined), false);
    assert.equal(isValidHttpsUrl(12345), false);
    assert.equal(isValidHttpsUrl("not-a-valid-url"), false);
  });
});

describe("2. Audit Helper Tanggal Kalender & Expiry UTC", () => {
  it("menerima tanggal kalender valid YYYY-MM-DD", () => {
    assert.equal(isValidCalendarDate("2026-11-07"), true);
    assert.equal(isValidCalendarDate("2024-02-29"), true); // Tahun kabisat
    assert.equal(isValidCalendarDate("2025-12-31"), true);
  });

  it("menolak tanggal yang tidak valid atau format salah", () => {
    assert.equal(isValidCalendarDate("2025-02-29"), false); // Bukan tahun kabisat
    assert.equal(isValidCalendarDate("2026-04-31"), false); // April hanya 30 hari
    assert.equal(isValidCalendarDate("2026-13-01"), false); // Bulan 13
    assert.equal(isValidCalendarDate("2026-00-10"), false); // Bulan 0
    assert.equal(isValidCalendarDate("2026-05-00"), false); // Hari 0
    assert.equal(isValidCalendarDate("07-11-2026"), false); // Format terbalik
    assert.equal(isValidCalendarDate("2026/11/07"), false); // Slash
    assert.equal(isValidCalendarDate("2026-1-7"), false); // Kurang padding nol
    assert.equal(isValidCalendarDate(""), false);
    assert.equal(isValidCalendarDate(null), false);
    assert.equal(isValidCalendarDate(undefined), false);
  });

  it("mengevaluasi kedaluwarsa tanggal UTC secara deterministik", () => {
    // Simulasi waktu saat ini: 2026-11-07 UTC
    const mockNow = new Date(Date.UTC(2026, 10, 7, 12, 0, 0));

    // Tanggal kemarin sudah lewat
    assert.equal(isDateExpiredUtc("2026-11-06", mockNow), true);
    // Tanggal hari ini belum kedaluwarsa (berlaku sampai akhir hari)
    assert.equal(isDateExpiredUtc("2026-11-07", mockNow), false);
    // Tanggal masa depan belum kedaluwarsa
    assert.equal(isDateExpiredUtc("2027-01-01", mockNow), false);
    // Tanggal malformed dianggap expired/tidak aman
    assert.equal(isDateExpiredUtc("invalid-date", mockNow), true);
  });
});

describe("3. Audit Helper Referensi Bukti Izin (isValidEvidenceReference) & PII", () => {
  it("menerima URL HTTPS publik sebagai referensi bukti", () => {
    assert.equal(isValidEvidenceReference("https://example.com/legal/license-statement"), true);
    // URL publik dengan path angka/token aman (bukan nomor telepon)
    assert.equal(isValidEvidenceReference("https://example.com/licenses/2026/track-12345678"), true);
  });

  it("menerima penanda rekam jejak internal privat yang aman", () => {
    assert.equal(isValidEvidenceReference("internal-private-record:rec-2026-auth-001"), true);
  });

  it("menolak referensi yang memuat data pribadi sensitif (PII) seperti email atau nomor telepon", () => {
    assert.equal(isValidEvidenceReference("internal-private-record:rec-contact-john.doe@example.com"), false);
    assert.equal(isValidEvidenceReference("internal-private-record:rec-+628123456789"), false);
    assert.equal(isValidEvidenceReference("https://example.com/license?email=creator@musisi.com"), false);
  });

  it("menolak referensi non-HTTPS publik atau string kosong", () => {
    assert.equal(isValidEvidenceReference("http://insecure.com/license"), false);
    assert.equal(isValidEvidenceReference("internal-private-record:"), false);
    assert.equal(isValidEvidenceReference(""), false);
    assert.equal(isValidEvidenceReference(null), false);
  });
});

describe("3.1. Audit Sistem Kategori Viral (ALLOWED_VIRAL_CATEGORIES)", () => {
  it("menerima 6 kategori resmi yang telah ditetapkan", () => {
    const expectedCategories = ["Galau", "Sad", "Romantic", "Funny", "Anime", "Speed Up"];
    assert.deepEqual([...ALLOWED_VIRAL_CATEGORIES], expectedCategories);
    for (const cat of expectedCategories) {
      assert.equal(isValidViralCategory(cat), true);
    }
  });

  it("menolak kategori tidak resmi atau tipe data salah", () => {
    assert.equal(isValidViralCategory("Rock"), false);
    assert.equal(isValidViralCategory("Random"), false);
    assert.equal(isValidViralCategory(""), false);
    assert.equal(isValidViralCategory(null), false);
    assert.equal(isValidViralCategory(undefined), false);
    assert.equal(isValidViralCategory(123), false);
  });
});

describe("4. Audit isValidLegalMeta() dengan Bukti Izin & Cakupan Hak", () => {
  const validSelfCreatedMeta = {
    licenseType: "CC0-1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    attributionText: "Karya Orisinal oleh Pengembang Web Music",
    creatorUrl: "https://example.com/developer-profile",
    verificationStatus: "verified",
    evidenceType: "self-created",
    evidenceReference: "https://example.com/original-work-declaration",
    permissionScope: ["streaming", "segment-editing", "website-distribution"],
    isProjectHosted: false,
    verifiedAt: "2026-11-07",
    verifierNotes: "Audio orisinal buatan sendiri dengan hak cipta penuh",
  };

  const validWrittenPermissionMeta = {
    licenseType: "Direct-Permission",
    licenseUrl: "https://example.com/artist-direct-license-terms",
    attributionText: "Sound oleh Musisi Sahabat (Izin Tertulis Resmi)",
    creatorUrl: "https://example.com/musisi-sahabat",
    verificationStatus: "verified",
    evidenceType: "written-permission",
    evidenceReference: "internal-private-record:rec-2026-direct-002",
    permissionScope: ["streaming", "segment-editing", "website-distribution"],
    isProjectHosted: false,
    verifiedAt: "2026-11-07",
    verifierNotes: "Surat izin tertulis disimpan di arsip internal kurator",
  };

  it("menerima audio orisinal buatan sendiri (self-created) yang lengkap", () => {
    assert.equal(isValidLegalMeta(validSelfCreatedMeta), true);
  });

  it("menerima izin tertulis (written-permission) dengan bukti privat internal terverifikasi", () => {
    assert.equal(isValidLegalMeta(validWrittenPermissionMeta), true);
  });

  it("menerima izin tertulis (written-permission) dengan bukti publik HTTPS", () => {
    const metaWithPublicEvidence = {
      ...validWrittenPermissionMeta,
      evidenceReference: "https://example.com/artist/public-permission-statement",
    };
    assert.equal(isValidLegalMeta(metaWithPublicEvidence), true);
  });

  it("menolak jika evidenceType tidak valid", () => {
    assert.equal(isValidLegalMeta({ ...validSelfCreatedMeta, evidenceType: "unknown-type" }), false);
    assert.equal(isValidLegalMeta({ ...validSelfCreatedMeta, evidenceType: "" }), false);
  });

  it("menolak jika evidenceReference mengandung data pribadi sensitif (PII)", () => {
    const unsafeMeta = {
      ...validWrittenPermissionMeta,
      evidenceReference: "Surat izin via email creator@musisi.com",
    };
    assert.equal(isValidLegalMeta(unsafeMeta), false);
  });

  it("menolak jika cakupan izin (permissionScope) tidak lengkap (kurang segment-editing atau streaming)", () => {
    // Tanpa segment-editing (dilarang memotong cuplikan 30 detik)
    const missingSegmentCut = {
      ...validWrittenPermissionMeta,
      permissionScope: ["streaming", "website-distribution"],
    };
    assert.equal(isValidLegalMeta(missingSegmentCut), false);

    // Tanpa streaming
    const missingStreaming = {
      ...validWrittenPermissionMeta,
      permissionScope: ["segment-editing", "website-distribution"],
    };
    assert.equal(isValidLegalMeta(missingStreaming), false);

    // Scope kosong
    assert.equal(isValidLegalMeta({ ...validWrittenPermissionMeta, permissionScope: [] }), false);
  });

  it("menolak jika izin telah dicabut atau kedaluwarsa (isRevoked: true)", () => {
    const revokedMeta = {
      ...validWrittenPermissionMeta,
      isRevoked: true,
    };
    assert.equal(isValidLegalMeta(revokedMeta), false);
  });

  it("menolak status verified jika bukti izin atau scope tidak memenuhi syarat", () => {
    const incompleteMeta = {
      ...validWrittenPermissionMeta,
      verificationStatus: "verified",
      evidenceReference: "bukan-url-dan-bukan-internal-record",
    };
    assert.equal(isValidLegalMeta(incompleteMeta), false);
  });

  // Uji Explicit Hosting Scope
  it("menerima isProjectHosted: false (audio eksternal, scope hosting tidak wajib)", () => {
    const externalAudio = {
      ...validWrittenPermissionMeta,
      isProjectHosted: false,
      permissionScope: ["streaming", "segment-editing", "website-distribution"],
    };
    assert.equal(isValidLegalMeta(externalAudio), true);
  });

  it("menerima isProjectHosted: true dengan scope hosting tersedia", () => {
    const hostedWithScope = {
      ...validWrittenPermissionMeta,
      isProjectHosted: true,
      permissionScope: ["streaming", "hosting", "segment-editing", "website-distribution"],
    };
    assert.equal(isValidLegalMeta(hostedWithScope), true);
  });

  it("menolak jika isProjectHosted: true namun scope hosting tidak tersedia", () => {
    const hostedWithoutScope = {
      ...validWrittenPermissionMeta,
      isProjectHosted: true,
      permissionScope: ["streaming", "segment-editing", "website-distribution"],
    };
    assert.equal(isValidLegalMeta(hostedWithoutScope), false);
  });

  it("menolak jika isProjectHosted tidak ada (undefined), null, atau tipe tidak valid", () => {
    const withoutHosted = { ...validWrittenPermissionMeta };
    delete withoutHosted.isProjectHosted;
    assert.equal(isValidLegalMeta(withoutHosted), false, "Wajib menolak jika isProjectHosted undefined");

    assert.equal(isValidLegalMeta({ ...validWrittenPermissionMeta, isProjectHosted: null }), false);
    assert.equal(isValidLegalMeta({ ...validWrittenPermissionMeta, isProjectHosted: "true" }), false);
    assert.equal(isValidLegalMeta({ ...validWrittenPermissionMeta, isProjectHosted: "false" }), false);
    assert.equal(isValidLegalMeta({ ...validWrittenPermissionMeta, isProjectHosted: 1 }), false);
    assert.equal(isValidLegalMeta({ ...validWrittenPermissionMeta, isProjectHosted: 0 }), false);
  });

  // Uji Expiry Date (expiresAt)
  it("mengevaluasi expiresAt: menerima yang belum kedaluwarsa dan menolak yang telah lewat", () => {
    const mockNow = new Date(Date.UTC(2026, 10, 7, 12, 0, 0)); // 2026-11-07 UTC

    // Batas hari ini (2026-11-07) masih valid sampai pergantian hari UTC
    const validToday = {
      ...validWrittenPermissionMeta,
      expiresAt: "2026-11-07",
    };
    assert.equal(isValidLegalMeta(validToday, mockNow), true);

    // Belum kedaluwarsa (masa depan)
    const validFuture = {
      ...validWrittenPermissionMeta,
      expiresAt: "2027-12-31",
    };
    assert.equal(isValidLegalMeta(validFuture, mockNow), true);

    // Sudah lewat (kemarin)
    const expiredPast = {
      ...validWrittenPermissionMeta,
      expiresAt: "2026-11-06",
    };
    assert.equal(isValidLegalMeta(expiredPast, mockNow), false, "Wajib menolak jika tanggal expiresAt telah lewat");

    // Tanggal expiresAt format salah/tidak valid
    const invalidDateFormat = {
      ...validWrittenPermissionMeta,
      expiresAt: "2026-02-30",
    };
    assert.equal(isValidLegalMeta(invalidDateFormat, mockNow), false, "Wajib menolak jika format tanggal tidak valid");
  });

  it("menolak track jika isRevoked: true meskipun expiresAt masih jauh di masa depan", () => {
    const mockNow = new Date(Date.UTC(2026, 10, 7, 12, 0, 0));
    const revokedWithFutureExpiry = {
      ...validWrittenPermissionMeta,
      expiresAt: "2030-01-01",
      isRevoked: true,
    };
    assert.equal(isValidLegalMeta(revokedWithFutureExpiry, mockNow), false);
  });
});

describe("5. Audit isValidUnifiedTrack() dengan Bukti Izin", () => {
  const validCuratedTrack = {
    id: "curated-001",
    source: "curated",
    type: "segment",
    title: "Senja di Kota",
    artist: "Musisi Indie",
    artwork: "https://example.com/artwork.jpg",
    audioUrl: "https://example.com/audio.mp3",
    duration: 120,
    previewDuration: 30,
    segmentStart: 45,
    segmentEnd: 75,
    isLoopable: true,
    attribution: "Musisi Indie (Izin Tertulis Resmi)",
    sourceUrl: "https://example.com/track/senja",
    legalMeta: {
      licenseType: "Direct-Permission",
      licenseUrl: "https://example.com/artist/license-terms",
      attributionText: "Musisi Indie (Izin Tertulis Resmi)",
      creatorUrl: "https://example.com/musisi",
      verificationStatus: "verified",
      evidenceType: "written-permission",
      evidenceReference: "internal-private-record:rec-2026-001",
      permissionScope: ["streaming", "segment-editing", "website-distribution"],
      isProjectHosted: false,
      verifiedAt: "2026-11-07",
    },
  };

  it("menerima curated track yang lengkap, berstatus verified, dan memiliki bukti izin sah", () => {
    assert.equal(isValidUnifiedTrack(validCuratedTrack), true);
  });

  it("menerima curated track dengan viralMeta (quote, trendTag, dan category valid)", () => {
    const trackWithViralMeta = {
      ...validCuratedTrack,
      viralMeta: {
        quote: "Malam tenang ditemani secangkir teh",
        trendTag: "Senja",
        category: "Galau",
      },
    };
    assert.equal(isValidUnifiedTrack(trackWithViralMeta), true);
  });

  it("menolak curated track jika category di viralMeta tidak terdaftar dalam kategori resmi", () => {
    const invalidCategoryTrack = {
      ...validCuratedTrack,
      viralMeta: {
        category: "Heavy-Metal-Non-Existent",
      },
    };
    assert.equal(isValidUnifiedTrack(invalidCategoryTrack), false);
  });

  it("menolak curated track jika izinnya telah dicabut (isRevoked: true)", () => {
    const revokedTrack = {
      ...validCuratedTrack,
      legalMeta: { ...validCuratedTrack.legalMeta, isRevoked: true },
    };
    assert.equal(isValidUnifiedTrack(revokedTrack), false);
  });

  it("menolak curated track yang berstatus pending atau rejected", () => {
    const pendingTrack = {
      ...validCuratedTrack,
      legalMeta: { ...validCuratedTrack.legalMeta, verificationStatus: "pending" },
    };
    assert.equal(isValidUnifiedTrack(pendingTrack), false);

    const rejectedTrack = {
      ...validCuratedTrack,
      legalMeta: { ...validCuratedTrack.legalMeta, verificationStatus: "rejected" },
    };
    assert.equal(isValidUnifiedTrack(rejectedTrack), false);
  });

  it("menolak curated track tanpa legalMeta", () => {
    const noLegal = { ...validCuratedTrack };
    delete noLegal.legalMeta;
    assert.equal(isValidUnifiedTrack(noLegal), false);
  });

  it("menolak track dengan nilai numerik NaN, Infinity, atau negatif", () => {
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, segmentStart: NaN }), false);
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, segmentEnd: Infinity }), false);
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, duration: -10 }), false);
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, segmentStart: -1 }), false);
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, segmentEnd: 10, segmentStart: 20 }), false);
  });

  it("menolak track dengan source yang tidak dikenal", () => {
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, source: "spotify" }), false);
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, source: "youtube" }), false);
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, source: "" }), false);
  });

  it("menolak input track null, undefined, atau kosong", () => {
    assert.equal(isValidUnifiedTrack(null), false);
    assert.equal(isValidUnifiedTrack(undefined), false);
    assert.equal(isValidUnifiedTrack({}), false);
    assert.equal(isValidUnifiedTrack({ ...validCuratedTrack, id: "" }), false);
  });
});

describe("6. Kompatibilitas Deezer Track", () => {
  it("adapter toUnifiedTrack menghasilkan track Deezer yang lolos isValidUnifiedTrack()", () => {
    const sampleDeezerRaw = {
      id: 12345678,
      title: "Lagu Populer",
      title_short: "Lagu Populer",
      preview: "https://cdns-preview-d.dzcdn.net/stream/sample.mp3",
      duration: 215,
      link: "https://www.deezer.com/track/12345678",
      artist: {
        id: 999,
        name: "Artis Terkenal",
        picture_medium: "https://e-cdns-images.dzcdn.net/images/artist/sample.jpg",
      },
      album: {
        id: 888,
        title: "Album Hits",
        cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/sample.jpg",
      },
    };

    const unified = toUnifiedTrack(sampleDeezerRaw);
    assert.ok(unified, "Hasil adapter toUnifiedTrack tidak boleh null");
    assert.equal(unified.source, "deezer");
    assert.equal(unified.duration, 215);
    assert.equal(unified.previewDuration, 30);
    assert.equal(unified.segmentStart, 0);
    assert.equal(unified.segmentEnd, 30);

    // Track Deezer tidak memerlukan legalMeta dan harus tetap valid
    assert.equal(isValidUnifiedTrack(unified), true);
  });
});

describe("7. Integritas Dataset Curated Publik & Filter Katalog", () => {
  it("curatedViralSounds harus berupa array kosong saat ini", () => {
    assert.ok(Array.isArray(curatedViralSounds), "curatedViralSounds harus berupa array");
    assert.equal(curatedViralSounds.length, 0, "Dataset curatedViralSounds harus tetap []");
  });

  it("memfilter dan mengeliminasi curated track yang tidak valid dari katalog tampilan", () => {
    const mockNow = new Date(Date.UTC(2026, 10, 7, 12, 0, 0));

    const mockCuratedCatalog = [
      // 1. Valid: Eksternal, scope lengkap, verified
      {
        id: "curated-001",
        source: "curated",
        type: "segment",
        title: "Track Valid Eksternal",
        artist: "Artis A",
        artwork: "https://example.com/art1.jpg",
        audioUrl: "https://example.com/audio1.mp3",
        duration: 60,
        previewDuration: 30,
        segmentStart: 0,
        segmentEnd: 30,
        isLoopable: true,
        attribution: "Artis A (CC-BY-4.0)",
        sourceUrl: "https://example.com/source1",
        legalMeta: {
          licenseType: "CC-BY-4.0",
          licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
          attributionText: "Artis A",
          creatorUrl: "https://example.com/creator1",
          verificationStatus: "verified",
          evidenceType: "written-permission",
          evidenceReference: "https://example.com/proof1",
          permissionScope: ["streaming", "segment-editing", "website-distribution"],
          isProjectHosted: false,
          expiresAt: "2027-01-01",
        },
      },
      // 2. Invalid: isProjectHosted true tapi tidak punya scope hosting
      {
        id: "curated-002",
        source: "curated",
        type: "segment",
        title: "Track Tanpa Scope Hosting",
        artist: "Artis B",
        artwork: "https://example.com/art2.jpg",
        audioUrl: "https://example.com/audio2.mp3",
        duration: 60,
        previewDuration: 30,
        segmentStart: 0,
        segmentEnd: 30,
        isLoopable: true,
        attribution: "Artis B",
        sourceUrl: "https://example.com/source2",
        legalMeta: {
          licenseType: "Direct-Permission",
          licenseUrl: "https://example.com/license2",
          attributionText: "Artis B",
          creatorUrl: "https://example.com/creator2",
          verificationStatus: "verified",
          evidenceType: "written-permission",
          evidenceReference: "internal-private-record:rec-002",
          permissionScope: ["streaming", "segment-editing", "website-distribution"],
          isProjectHosted: true, // Wajib scope hosting!
        },
      },
      // 3. Invalid: expiresAt sudah lewat
      {
        id: "curated-003",
        source: "curated",
        type: "segment",
        title: "Track Kedaluwarsa",
        artist: "Artis C",
        artwork: "https://example.com/art3.jpg",
        audioUrl: "https://example.com/audio3.mp3",
        duration: 60,
        previewDuration: 30,
        segmentStart: 0,
        segmentEnd: 30,
        isLoopable: true,
        attribution: "Artis C",
        sourceUrl: "https://example.com/source3",
        legalMeta: {
          licenseType: "Direct-Permission",
          licenseUrl: "https://example.com/license3",
          attributionText: "Artis C",
          creatorUrl: "https://example.com/creator3",
          verificationStatus: "verified",
          evidenceType: "written-permission",
          evidenceReference: "internal-private-record:rec-003",
          permissionScope: ["streaming", "segment-editing", "website-distribution"],
          isProjectHosted: false,
          expiresAt: "2026-11-06", // Kemarin!
        },
      },
      // 4. Invalid: status pending
      {
        id: "curated-004",
        source: "curated",
        type: "segment",
        title: "Track Pending",
        artist: "Artis D",
        artwork: "https://example.com/art4.jpg",
        audioUrl: "https://example.com/audio4.mp3",
        duration: 60,
        previewDuration: 30,
        segmentStart: 0,
        segmentEnd: 30,
        isLoopable: true,
        attribution: "Artis D",
        sourceUrl: "https://example.com/source4",
        legalMeta: {
          licenseType: "CC0-1.0",
          licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
          attributionText: "Artis D",
          creatorUrl: "https://example.com/creator4",
          verificationStatus: "pending",
          evidenceType: "self-created",
          evidenceReference: "https://example.com/proof4",
          permissionScope: ["streaming", "segment-editing", "website-distribution"],
          isProjectHosted: false,
        },
      },
    ];

    // Menerapkan logika filter persis seperti pada ViralSoundsView.jsx
    const filteredForView = mockCuratedCatalog.filter(
      (track) =>
        isValidUnifiedTrack(track, mockNow) &&
        track.legalMeta?.verificationStatus === "verified"
    );

    assert.equal(filteredForView.length, 1, "Hanya 1 track yang boleh lolos filter tampilan");
    assert.equal(filteredForView[0].id, "curated-001");
  });

  it("memastikan guard isValidUnifiedTrack menolak track curated invalid agar tidak dapat diputar", () => {
    // Skenario track curated dengan metadata cacat/palsu
    const invalidTrack = {
      id: "curated-fake",
      source: "curated",
      title: "Sound Palsu",
      artist: "Penipu",
      audioUrl: "https://example.com/fake.mp3",
      duration: 30,
      previewDuration: 30,
      segmentStart: 0,
      segmentEnd: 30,
      isLoopable: true,
      legalMeta: {
        verificationStatus: "verified", // Berstatus verified tapi field lainnya bolong
      },
    };

    assert.equal(isValidUnifiedTrack(invalidTrack), false, "Track curated cacat wajib gagal validasi");
  });
});

describe("8. Regression Audit Playback Engine & Single Audio Element", () => {
  it("track Deezer tanpa legalMeta bebas dari penolakan guard curated", () => {
    const validDeezer = {
      id: "dz-998877",
      source: "deezer",
      type: "preview",
      title: "Deezer Hit Single",
      artist: "Deezer Star",
      artwork: "https://e-cdns-images.dzcdn.net/images/cover/sample.jpg",
      audioUrl: "https://cdns-preview-d.dzcdn.net/stream/sample.mp3",
      duration: 180,
      previewDuration: 30,
      segmentStart: 0,
      segmentEnd: 30,
      isLoopable: false,
    };

    // Track Deezer tidak boleh ditolak oleh isValidUnifiedTrack
    assert.equal(isValidUnifiedTrack(validDeezer), true);
  });

  it("simulasi alur engine playTrack: track curated invalid memicu penolakan dini sebelum play()", () => {
    let playCallCount = 0;
    let pauseCallCount = 0;
    let errorState = null;
    let isPlayingState = true;
    let isLoadingState = true;

    const mockAudioElement = {
      src: "https://example.com/current-song.mp3",
      play: () => {
        playCallCount++;
        return Promise.resolve();
      },
      pause: () => {
        pauseCallCount++;
      },
    };

    // Fungsi simulasi yang memodelkan guard engine playTrack() di AudioContext.jsx secara presisi
    const simulatePlayTrack = (track) => {
      if (!track) return;

      if (track.source === "curated" && !isValidUnifiedTrack(track)) {
        if (mockAudioElement) {
          mockAudioElement.pause();
        }
        errorState = "Track tidak memenuhi standar verifikasi legal";
        isPlayingState = false;
        isLoadingState = false;
        return;
      }

      mockAudioElement.src = track.audioUrl;
      mockAudioElement.play();
    };

    // 1. Uji penolakan track curated invalid
    const invalidCurated = {
      id: "curated-bad",
      source: "curated",
      title: "Sound Cacat",
      artist: "Anonim",
      audioUrl: "https://example.com/bad.mp3",
      duration: 30,
      previewDuration: 30,
      segmentStart: 0,
      segmentEnd: 30,
      isLoopable: true,
      legalMeta: { isRevoked: true }, // Revoked!
    };

    simulatePlayTrack(invalidCurated);

    assert.equal(playCallCount, 0, "audio.play() tidak boleh dipanggil untuk curated track yang ditolak");
    assert.equal(pauseCallCount, 1, "audio.pause() wajib dipanggil untuk menghentikan audio yang sedang berjalan");
    assert.equal(isPlayingState, false, "isPlaying harus false");
    assert.equal(isLoadingState, false, "isLoading harus false");
    assert.equal(errorState, "Track tidak memenuhi standar verifikasi legal");
    assert.equal(mockAudioElement.src, "https://example.com/current-song.mp3", "audio.src tidak boleh berubah ke audioUrl track yang ditolak");

    // 2. Uji kelolosan track Deezer
    const validDeezer = {
      id: "dz-123",
      source: "deezer",
      type: "preview",
      title: "Lagu Deezer",
      artist: "Penyanyi",
      artwork: "https://example.com/art.jpg",
      audioUrl: "https://example.com/deezer-preview.mp3",
      duration: 180,
      previewDuration: 30,
      segmentStart: 0,
      segmentEnd: 30,
      isLoopable: false,
    };

    simulatePlayTrack(validDeezer);

    assert.equal(playCallCount, 1, "audio.play() harus dipanggil untuk track Deezer yang valid");
    assert.equal(mockAudioElement.src, "https://example.com/deezer-preview.mp3");
  });
});
