// Data pemetaan peserta ke project, untuk dua batch.
//
// Sumber: rekapitulasi penugasan project per akun master, ditambah CSV
// "webGIS Training Batch 2 - akun_gcp.csv". Kolom saran dan masukan dari
// formulir TIDAK disertakan, karena isinya masukan pribadi peserta, bukan data
// yang perlu dipublikasikan.
//
// Berkas ini dibangkitkan, bukan ditulis manual, supaya tidak ada nama atau
// email yang salah ketik. Batch 2 dibangkitkan oleh
// scripts/bangkitkan-peserta.mjs, yang membaca CSV-nya dan menggabungkannya
// dengan batch 1 pada berkas ini.
//
// Kolom "batch" menandai asal peserta. Satu akun master dan satu project
// dipakai bersama oleh kedua batch, sedangkan nama orang pada akun master itu
// dapat berbeda antar batch.

export const kelompokPeserta = [
  {
    "master": "Hifnie (kerjaanaldira)",
    "akun": "kerjaanaldira",
    "project": {
      "a": "geoportal-kelompok-a-a1ad9",
      "b": "geoportal-kelompok-b-a1ad9",
      "c": "geoportal-kelompok-c-a1ad9"
    },
    "peserta": [
      {
        "nama": "Amellia Kinanti",
        "email": "amelliakinanti@gmail.com",
        "namaPeserta": "amelliak",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "arif",
        "email": "aprianto.arif@gmail.com",
        "namaPeserta": "aprianto",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Arum Wahyu Hastuti",
        "email": "arumwahyu2022@gmail.com",
        "namaPeserta": "arumwahy",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Fadhil Abryanto Nugraha",
        "email": "fadhil.abr@gmail.com",
        "namaPeserta": "fadhilabr",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Fajar Agung Suprapto",
        "email": "supraptofajaragung@gmail.com",
        "namaPeserta": "suprapto",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Faqih Rohmatulloh",
        "email": "faqihrohmatulloh.id@gmail.com",
        "namaPeserta": "faqihrohm",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Febrian Maritimo",
        "email": "maritimo.febrian@gmail.com",
        "namaPeserta": "maritimo",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Fernanda Rusmayanti",
        "email": "rusmayantifernanda@gmail.com",
        "namaPeserta": "rusmayant",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Istighfary Abirama Cininta",
        "email": "istighfaryabirama@gmail.com",
        "namaPeserta": "istighfa",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Mica Alphabettika",
        "email": "micaa768@gmail.com",
        "namaPeserta": "micaa",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Muhamad Bambang Suwahyuono",
        "email": "muhamadbambang27@gmail.com",
        "namaPeserta": "muhamadb",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Muhammad Wildan",
        "email": "muhammadwildan.surveyor@gmail.com",
        "namaPeserta": "muhammadwi",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Murdaningsih",
        "email": "daning.panularsih@gmail.com",
        "namaPeserta": "daning",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "raihaan m asha",
        "email": "raihaanmasha@gmail.com",
        "namaPeserta": "raihaanm",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Rastika Widiastuti",
        "email": "rastika.widiastuti@gmail.com",
        "namaPeserta": "rastika",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Ria Purnama Putri",
        "email": "riapurnamaputri@gmail.com",
        "namaPeserta": "riapurnam",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Tika Nurhasanah",
        "email": "tikanurhasanah10@gmail.com",
        "namaPeserta": "tikanurh",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Tri Raharjo",
        "email": "triraharjo.mail@gmail.com",
        "namaPeserta": "triraharj",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Wildan Firdaus",
        "email": "wildan.firdaus5@gmail.com",
        "namaPeserta": "wildan",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Winda Agustin",
        "email": "winda.agustin268@gmail.com",
        "namaPeserta": "windaagus",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Yulia Ira Amelia",
        "email": "yuliamelia04@gmail.com",
        "namaPeserta": "yuliamelia",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Ziyadatul Rofita",
        "email": "zydta.ziya@gmail.com",
        "namaPeserta": "zydta",
        "bagian": "b",
        "batch": 2
      }
    ]
  },
  {
    "master": "Dhany (arkabumihd1)",
    "akun": "arkabumihd1",
    "project": {
      "a": "geoportal-kelompok-a-92650",
      "b": "geoportal-kelompok-b-92650",
      "c": "geoportal-kelompok-c-92650"
    },
    "peserta": [
      {
        "nama": "adnan",
        "email": "spesialgeo@gmail.com",
        "namaPeserta": "spesialg",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Afit Budimantoro",
        "email": "afitbudimantoro26@gmail.com",
        "namaPeserta": "afitbudi",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Dedi Wahyu Sasongko",
        "email": "dediwahyusasongko@gmail.com",
        "namaPeserta": "dediwahy",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Didit S",
        "email": "diditsetiawan192@gmail.com",
        "namaPeserta": "diditseti",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Dwi Wahyu Utomo",
        "email": "d.21utomo@gmail.com",
        "namaPeserta": "d21utomo",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Emir Muhamad Zaid",
        "email": "zaidemirm@gmail.com",
        "namaPeserta": "zaidemirm",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Endang Purwati",
        "email": "endangpurwati.pprt2017@gmail.com",
        "namaPeserta": "endangpu",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Fadillah Ibnu M",
        "email": "extraharrom@gmail.com",
        "namaPeserta": "extraharrom",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Irfan Tri Anggoro",
        "email": "irfantria12@gmail.com",
        "namaPeserta": "irfantria",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Meita Solehawati",
        "email": "meitasolehawati000@gmail.com",
        "namaPeserta": "meitasol",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Muhammad Adnan Shafry Untoro",
        "email": "adnshafry@gmail.com",
        "namaPeserta": "adnshafry",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Muhammad Farhan",
        "email": "muhammadfarhan0719@gmail.com",
        "namaPeserta": "muhammad",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "obil",
        "email": "raniasalsabila00@gmail.com",
        "namaPeserta": "raniasal",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Ranisa Amalia Sholikhah",
        "email": "ranisaamalia99@gmail.com",
        "namaPeserta": "ranisaam",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Rendi Dewantara",
        "email": "rendidewantara@gmail.com",
        "namaPeserta": "rendidewa",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Rohullah Ragajaya",
        "email": "ragajayarohullah@gmail.com",
        "namaPeserta": "ragajaya",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Sarah Leila Hanief",
        "email": "sarahleilahanief@gmail.com",
        "namaPeserta": "sarahleil",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Tri Widowati",
        "email": "widoge05@gmail.com",
        "namaPeserta": "widoge",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Tutus Al-Meyda Mujahid",
        "email": "tusdaaa@gmail.com",
        "namaPeserta": "tusdaaa",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Yana Oktaviana",
        "email": "yanaoktav23@gmail.com",
        "namaPeserta": "yanaoktav",
        "bagian": "a",
        "batch": 2
      }
    ]
  },
  {
    "master": "Reza (baimonml)",
    "akun": "baimonml",
    "project": {
      "a": "geoportal-kelompok-a-d8290",
      "b": "geoportal-kelompok-b-d8290",
      "c": "geoportal-kelompok-c-d8290"
    },
    "peserta": [
      {
        "nama": "Abdurrohman Attirmidzi",
        "email": "abdurrohmanattirmidzi@gmail.com",
        "namaPeserta": "abdurrohm",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Ahmad Syahrul Fakhri",
        "email": "fahriahmad124@gmail.com",
        "namaPeserta": "fahriahm",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Andyan Putra Prajamandana",
        "email": "andyanputra14@gmail.com",
        "namaPeserta": "andyanput",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Annisa Rahmawati Timur",
        "email": "nisaadilio@gmail.com",
        "namaPeserta": "nisaadil",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Arifah Trisnawati",
        "email": "arifahtrs12@gmail.com",
        "namaPeserta": "arifahtr",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Arum Suryandari",
        "email": "arumsuryandari.s@gmail.com",
        "namaPeserta": "arumsurya",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Bisma Jaja Zakaria",
        "email": "bismajz@gmail.com",
        "namaPeserta": "bismajz",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "davin aristomo",
        "email": "aristomodav@gmail.com",
        "namaPeserta": "aristomo",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Diana Rizqi",
        "email": "dianarizqi03@gmail.com",
        "namaPeserta": "dianariz",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Dinda Chyntia Jamal",
        "email": "dinda.jamal@gmail.com",
        "namaPeserta": "dinda",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Imam Sholichin",
        "email": "imamjakarta48@gmail.com",
        "namaPeserta": "imamjakar",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Inggit Diah Novitaningrum",
        "email": "inggit.gd06@gmail.com",
        "namaPeserta": "inggitdiah",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "M Faozi Nasrulloh",
        "email": "faozinasrulloh@gmail.com",
        "namaPeserta": "faozinasr",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Pradipta Adi Nugraha",
        "email": "adinugraha289@gmail.com",
        "namaPeserta": "adinugra",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Prama Ardha Aryaguna",
        "email": "pra.ardha@gmail.com",
        "namaPeserta": "pra",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Putri Laila K.N",
        "email": "3putrikartika981@gmail.com",
        "namaPeserta": "putrikart",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Rizka Nurul Fatimah",
        "email": "rizkanurulfatimah01@gmail.com",
        "namaPeserta": "rizkanur",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Sozanolo Ndruru",
        "email": "ozan88aqua@gmail.com",
        "namaPeserta": "ozan",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Suci Tresna Novianti",
        "email": "sucitresnanovianti@gmail.com",
        "namaPeserta": "sucitresn",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Yofri Furqani Hakim",
        "email": "yofrifh@gmail.com",
        "namaPeserta": "yofrifh",
        "bagian": "c",
        "batch": 1
      }
    ]
  },
  {
    "master": "Yovita (baimongenshin)",
    "akun": "baimongenshin",
    "project": {
      "a": "geoportal-kelompok-a-be8bf",
      "b": "geoportal-kelompok-b-be8bf",
      "c": "geoportal-kelompok-c-be8bf"
    },
    "peserta": [
      {
        "nama": "Aldilla Gardika Pramesta",
        "email": "aldillapramesta@gmail.com",
        "namaPeserta": "aldillap",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Arif Rahman",
        "email": "ar.man.kpj@gmail.com",
        "namaPeserta": "arman",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Baisus Saadatul Usriyah",
        "email": "baisus1999@gmail.com",
        "namaPeserta": "baisus19",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Damar galih maulida",
        "email": "galih.onex@gmail.com",
        "namaPeserta": "galih",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Dias Eramudadi",
        "email": "diaseramudadi@gmail.com",
        "namaPeserta": "diaseramu",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Gauri Amida Parvati",
        "email": "gdbasegauri@gmail.com",
        "namaPeserta": "gdbasega",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "I Ketut Sutarga",
        "email": "ikets64@gmail.com",
        "namaPeserta": "ikets64",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "I Wayan Gede Krisna Arimjaya",
        "email": "krisnaarimjaya@gmail.com",
        "namaPeserta": "krisnaarim",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Ilham Sulaeman",
        "email": "ilhansulaeman25@gmail.com",
        "namaPeserta": "ilhansula",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Muhammad Reza Muzadhin",
        "email": "mrezamuzadhin@gmail.com",
        "namaPeserta": "mrezamuz",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Nandia Putri",
        "email": "nandiaputri612@gmail.com",
        "namaPeserta": "nandiaput",
        "bagian": "c",
        "batch": 2
      },
      {
        "nama": "Puji Nurhidayah",
        "email": "pujinhidayah@gmail.com",
        "namaPeserta": "pujinhida",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Putra Setiawan",
        "email": "psetiawan926@gmail.com",
        "namaPeserta": "psetiawan",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "Ramadhani Dwi Aulia",
        "email": "ramadhanidwia29@gmail.com",
        "namaPeserta": "ramadhan",
        "bagian": "a",
        "batch": 1
      },
      {
        "nama": "Rizky Fadzilah Nur",
        "email": "fadzilahnurrizky@gmail.com",
        "namaPeserta": "fadzilahnur",
        "bagian": "a",
        "batch": 2
      },
      {
        "nama": "ROFIQOH",
        "email": "rofiqoh.tgd@gmail.com",
        "namaPeserta": "rofiqoh",
        "bagian": "b",
        "batch": 2
      },
      {
        "nama": "Roza Oktama",
        "email": "rozamail08@gmail.com",
        "namaPeserta": "rozamail",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Tito Kanekaputra",
        "email": "tkanekaputra@gmail.com",
        "namaPeserta": "tkanekap",
        "bagian": "c",
        "batch": 1
      },
      {
        "nama": "Yuniarsita Setyo Wulandari",
        "email": "yuniarsitasetyow@gmail.com",
        "namaPeserta": "yuniarsi",
        "bagian": "b",
        "batch": 1
      },
      {
        "nama": "Zulaikha Fajri Nur Rachmah",
        "email": "zulaikha.rachmah@gmail.com",
        "namaPeserta": "zulaikha",
        "bagian": "a",
        "batch": 1
      }
    ]
  }
]
