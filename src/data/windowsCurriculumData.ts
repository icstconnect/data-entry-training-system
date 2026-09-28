import { Achievement } from '../types';
import { FileManagementLevel, FolderManagementLevel } from '../types/windows';

// ==========================================
// TRACK 1: FILE MANAGEMENT (5 LEVELS)
// ==========================================
export const FILE_MANAGEMENT_LEVELS: Record<number, FileManagementLevel> = {
  1: {
    levelNumber: 1,
    title: "Level 1: Extensions & Types (Class 3-5)",
    badge: "Class 3-5: Extensions",
    goal: "Sort the chaotic Desktop files into their respective folders based on file extensions: Documents (.docx, .txt, .pdf), Presentations (.pptx), Spreadsheets (.xlsx), Media (.mp3, .mp4), and Pictures (.jpeg).",
    goalBn: "ডেস্কটপের ছড়ানো-ছিটানো ফাইলগুলোকে তাদের ধরন অনুযায়ী ফোল্ডারে সাজিয়ে রাখুন: ডকুমেন্টস (.docx, .txt, .pdf), প্রেজেন্টেশন (.pptx), স্প্রেডশিট (.xlsx), অডিও-ভিডিও (.mp3, .mp4) এবং ছবি (.jpeg)।",
    targetFolders: [
      { 
        id: 'f_docs', 
        name: 'Documents', 
        icon: '📁', 
        accepted: ['docx', 'txt', 'pdf'],
        infoTitle: 'Documents Folder',
        infoEn: 'Store written articles, notes, essays, and PDF forms here.',
        infoBn: 'সব পড়ার বই, লেখার ফাইল, সাধারণ নোট ও পিডিএফ এখানে রাখুন।'
      },
      { 
        id: 'f_slides', 
        name: 'Presentations', 
        icon: '📁', 
        accepted: ['pptx'],
        infoTitle: 'Presentations Folder',
        infoEn: 'Store PowerPoint slide decks for class seminars and talks here.',
        infoBn: 'ক্লাসে বা মিটিংয়ে উপস্থাপনের সব পাওয়ারপয়েন্ট স্লাইড এখানে রাখুন।'
      },
      { 
        id: 'f_sheets', 
        name: 'Spreadsheets', 
        icon: '📁', 
        accepted: ['xlsx'],
        infoTitle: 'Spreadsheets Folder',
        infoEn: 'Store calculation tables, math sheets, and numerical lists here.',
        infoBn: 'গণনার হিসাব, খরচ ও সংখ্যার সব এক্সেল টেবিল ফাইল এখানে রাখুন।'
      },
      { 
        id: 'f_media', 
        name: 'Audio_Video', 
        icon: '📁', 
        accepted: ['mp3', 'mp4'],
        infoTitle: 'Audio & Video Folder',
        infoEn: 'Store recorded sounds, music tracks, and video clips here.',
        infoBn: 'গান, রেকর্ড করা কথা ও ভিডিও ক্লিপগুলো এখানে রাখুন।'
      },
      { 
        id: 'f_pics', 
        name: 'Pictures', 
        icon: '📁', 
        accepted: ['jpeg', 'png'],
        infoTitle: 'Pictures Folder',
        infoEn: 'Store camera photos, snapshots, and digital graphics here.',
        infoBn: 'ক্যামেরা দিয়ে তোলা সব ছবি ও ড্রয়িং ফাইল এখানে রাখুন।'
      },
    ],
    files: [
      { 
        id: 'file_1', 
        name: 'Science_Report.docx', 
        ext: 'docx', 
        size: '24 KB', 
        date: '2026-09-21', 
        targetFolderId: 'f_docs', 
        preview: 'Science Experiment: Photosynthesis and Solar Energy.\nWritten by Dita Student.',
        infoTitle: 'Science Report (.docx)',
        infoEn: '.docx is a Word document for written work. Belongs in Documents folder.',
        infoBn: '.docx হলো লেখার ওয়ার্ড ফাইল। এটি Documents ফোল্ডারে যাবে।'
      },
      { 
        id: 'file_2', 
        name: 'Solar_System_Deck.pptx', 
        ext: 'pptx', 
        size: '1.8 MB', 
        date: '2026-09-20', 
        targetFolderId: 'f_slides', 
        preview: 'Slide 1: Journey to Mars.\nSlide 2: The Asteroid Belt.',
        infoTitle: 'Solar System Deck (.pptx)',
        infoEn: '.pptx is a presentation slide deck. Belongs in Presentations folder.',
        infoBn: '.pptx হলো পাওয়ারপয়েন্ট স্লাইড ফাইল। এটি Presentations ফোল্ডারে যাবে।'
      },
      { 
        id: 'file_3', 
        name: 'Weekly_Allowance_Calc.xlsx', 
        ext: 'xlsx', 
        size: '14 KB', 
        date: '2026-09-22', 
        targetFolderId: 'f_sheets', 
        preview: 'Row 1: Day | Expense | Balance\nMon | Books | $10\nTue | Lunch | $15',
        infoTitle: 'Allowance Calculator (.xlsx)',
        infoEn: '.xlsx is a spreadsheet table with numbers. Belongs in Spreadsheets folder.',
        infoBn: '.xlsx হলো হিসাবের এক্সেল শিট। এটি Spreadsheets ফোল্ডারে যাবে।'
      },
      { 
        id: 'file_4', 
        name: 'School_Picnic_Photo.jpeg', 
        ext: 'jpeg', 
        size: '2.4 MB', 
        date: '2026-09-18', 
        targetFolderId: 'f_pics', 
        preview: 'Image: 4K Sunset at National Park.',
        infoTitle: 'School Picnic Photo (.jpeg)',
        infoEn: '.jpeg is a photograph image. Belongs in Pictures folder.',
        infoBn: '.jpeg হলো ক্যামেরা দিয়ে তোলা ছবি। এটি Pictures ফোল্ডারে যাবে।'
      },
      { 
        id: 'file_5', 
        name: 'Podcast_Episode_01.mp3', 
        ext: 'mp3', 
        size: '5.1 MB', 
        date: '2026-09-19', 
        targetFolderId: 'f_media', 
        preview: 'Audio Track: 44.1kHz Stereo - AI Tech Talk episode 1.',
        infoTitle: 'Podcast Episode 01 (.mp3)',
        infoEn: '.mp3 is an audio sound recording. Belongs in Audio_Video folder.',
        infoBn: '.mp3 হলো শোনার মতো অডিও সাউন্ড ফাইল। এটি Audio_Video ফোল্ডারে যাবে।'
      },
      { 
        id: 'file_6', 
        name: 'Robotics_Demo_Reel.mp4', 
        ext: 'mp4', 
        size: '22 MB', 
        date: '2026-09-23', 
        targetFolderId: 'f_media', 
        preview: 'Video: 1080p 60fps - Autonomous Line Follower Robot.',
        infoTitle: 'Robotics Demo Reel (.mp4)',
        infoEn: '.mp4 is a video movie clip. Belongs in Audio_Video folder.',
        infoBn: '.mp4 হলো একটি ভিডিও ক্লিপ ফাইল। এটি Audio_Video ফোল্ডারে যাবে।'
      },
      { 
        id: 'file_7', 
        name: 'Parent_Signature_Form.pdf', 
        ext: 'pdf', 
        size: '310 KB', 
        date: '2026-09-24', 
        targetFolderId: 'f_docs', 
        preview: 'Official Permission Slip for Robotics Field Trip.',
        infoTitle: 'Parent Signature Form (.pdf)',
        infoEn: '.pdf is a fixed layout document for reading/printing. Belongs in Documents folder.',
        infoBn: '.pdf হলো প্রিন্ট বা পড়ার মতো ডকুমেন্ট। এটি Documents ফোল্ডারে যাবে।'
      },
      { 
        id: 'file_8', 
        name: 'Quick_Ideas_Notes.txt', 
        ext: 'txt', 
        size: '2 KB', 
        date: '2026-09-25', 
        targetFolderId: 'f_docs', 
        preview: 'Todo:\n- Buy Arduino board\n- Read chapter 4 on neural nets.',
        infoTitle: 'Quick Ideas Notes (.txt)',
        infoEn: '.txt is an unformatted plain text note. Belongs in Documents folder.',
        infoBn: '.txt হলো সাধারণ টেক্সট নোট ফাইল। এটি Documents ফোল্ডারে যাবে।'
      },
    ]
  },
  2: {
    levelNumber: 2,
    title: "Level 2: School Subjects Tree (Class 6-7)",
    badge: "Class 6-7: Academic Hierarchy",
    goal: "Organize academic homework and project files into appropriate subject directories: Mathematics, Science_Lab, English_Lit, and AI_Robotics_CS.",
    goalBn: "স্কুলের পড়াশোনার বাড়ির কাজ ও প্রজেক্ট ফাইলগুলো সংশ্লিষ্ট বিষয়ের ফোল্ডারে গুছিয়ে রাখুন: Mathematics, Science_Lab, English_Lit, এবং AI_Robotics_CS।",
    targetFolders: [
      { 
        id: 'f_math', 
        name: 'Mathematics', 
        icon: '📁', 
        accepted: ['math'],
        infoTitle: 'Mathematics Subject Folder',
        infoEn: "Mathematics folder: Store math formulas, geometry sheets, algebra tables, and calculations here.",
        infoBn: "গণিত ফোল্ডার: বীজগণিত, জ্যামিতি ও হিসাব-নিকাশের ফাইল এখানে রাখুন।"
      },
      { 
        id: 'f_sci', 
        name: 'Science_Lab', 
        icon: '📁', 
        accepted: ['science'],
        infoTitle: 'Science Lab Subject Folder',
        infoEn: "Science Lab folder: Store physics experiments, chemistry titration reports, and biology observation files here.",
        infoBn: "বিজ্ঞান ল্যাব ফোল্ডার: পদার্থবিজ্ঞান, রসায়ন পরীক্ষা ও বিজ্ঞানের সব রিপোর্ট এখানে রাখুন।"
      },
      { 
        id: 'f_eng', 
        name: 'English_Lit', 
        icon: '📁', 
        accepted: ['english'],
        infoTitle: 'English Literature Folder',
        infoEn: "English Literature folder: Store drama essays, poetry analyses, and creative writing here.",
        infoBn: "ইংরেজি সাহিত্য ফোল্ডার: প্রবন্ধ, কবিতা ও নাটকের সব লেখা এখানে সংরক্ষণ করুন।"
      },
      { 
        id: 'f_ai', 
        name: 'AI_Robotics_CS', 
        icon: '📁', 
        accepted: ['ai_cs'],
        infoTitle: 'AI & Robotics Folder',
        infoEn: "AI & Computer Science folder: Store machine learning decks, robotics sensors, and Python scripts here.",
        infoBn: "এআই ও কম্পিউটার ফোল্ডার: কৃত্রিম বুদ্ধিমত্তা, রোবট ও কোডিং স্ক্রিপ্ট এখানে রাখুন।"
      },
    ],
    files: [
      { 
        id: 'f2_1', 
        name: 'Linear_Algebra_Formulas.xlsx', 
        ext: 'xlsx', 
        size: '32 KB', 
        date: '2026-09-22', 
        targetFolderId: 'f_math', 
        preview: 'Matrices, Determinants, and Dot Product equations.',
        infoTitle: 'Linear Algebra Formulas',
        infoEn: 'This file contains math matrix equations and algebra formulas. It belongs in the Mathematics folder.',
        infoBn: 'এই ফাইলে বীজগণিতের ম্যাট্রিক্স ও সমীকরণ রয়েছে। এটি Mathematics ফোল্ডারে রাখা উচিত।'
      },
      { 
        id: 'f2_2', 
        name: 'Chemistry_Titration_Lab.docx', 
        ext: 'docx', 
        size: '45 KB', 
        date: '2026-09-23', 
        targetFolderId: 'f_sci', 
        preview: 'Acid-Base Titration with Phenolphthalein indicator.',
        infoTitle: 'Chemistry Titration Lab Report',
        infoEn: 'This document contains an acid-base chemistry lab experiment. It belongs in the Science_Lab folder.',
        infoBn: 'এটি রসায়নের অ্যাসিড-ক্ষার পরীক্ষার একটি ব্যবহারিক রিপোর্ট। এটি Science_Lab ফোল্ডারে যাবে।'
      },
      { 
        id: 'f2_3', 
        name: 'Shakespeare_Macbeth_Essay.docx', 
        ext: 'docx', 
        size: '28 KB', 
        date: '2026-09-24', 
        targetFolderId: 'f_eng', 
        preview: 'Ambition and Fate in Shakespearean Tragedy.',
        infoTitle: "Shakespeare's Macbeth Essay",
        infoEn: 'This essay analyzes Shakespeare’s drama Macbeth. It belongs in the English_Lit folder.',
        infoBn: 'এটি শেক্সপিয়ারের নাটক ম্যাকবেথ নিয়ে লেখা ইংরেজি সাহিত্যের প্রবন্ধ। এটি English_Lit ফোল্ডারে যাবে।'
      },
      { 
        id: 'f2_4', 
        name: 'Computer_Vision_Intro.pptx', 
        ext: 'pptx', 
        size: '3.4 MB', 
        date: '2026-09-25', 
        targetFolderId: 'f_ai', 
        preview: 'Convolutional Filters and Edge Detection in OpenCV.',
        infoTitle: 'Computer Vision Introduction Deck',
        infoEn: 'This slide presentation explains AI computer vision and image filters. It belongs in the AI_Robotics_CS folder.',
        infoBn: 'এটি কৃত্রিম বুদ্ধিমত্তা (AI) ও কম্পিউটার ভিশন সম্পর্কিত স্লাইড। এটি AI_Robotics_CS ফোল্ডারে যাবে।'
      },
      { 
        id: 'f2_5', 
        name: 'Geometry_Theorems_CheatSheet.pdf', 
        ext: 'pdf', 
        size: '420 KB', 
        date: '2026-09-25', 
        targetFolderId: 'f_math', 
        preview: 'Pythagorean Theorem and Circle Arc Lengths.',
        infoTitle: 'Geometry Theorems Cheat Sheet',
        infoEn: 'This reference sheet summarizes geometric theorems and circle formulas. It belongs in the Mathematics folder.',
        infoBn: 'এটি জ্যামিতির উপপাদ্য ও সূত্রের সংক্ষিপ্ত নোট। এটি Mathematics ফোল্ডারে রাখা উচিত।'
      },
      { 
        id: 'f2_6', 
        name: 'Physics_Pendulum_Oscillation.mp4', 
        ext: 'mp4', 
        size: '14 MB', 
        date: '2026-09-20', 
        targetFolderId: 'f_sci', 
        preview: 'Slow motion video capture of simple harmonic motion.',
        infoTitle: 'Physics Pendulum Video Demo',
        infoEn: 'This video demonstrates pendulum oscillation for a physics practical. It belongs in the Science_Lab folder.',
        infoBn: 'এটি পদার্থবিজ্ঞানের সরল দোলকের গতির ওপর একটি ভিডিও ক্লিপ। এটি Science_Lab ফোল্ডারে যাবে।'
      },
      { 
        id: 'f2_7', 
        name: 'Python_Sensor_Logger.py', 
        ext: 'txt', 
        size: '4 KB', 
        date: '2026-09-26', 
        targetFolderId: 'f_ai', 
        preview: 'import time\nimport sensor\nwhile True: print(sensor.read())',
        infoTitle: 'Python Robotics Sensor Script',
        infoEn: 'This is a Python script that reads data from a robot sensor. It belongs in the AI_Robotics_CS folder.',
        infoBn: 'এটি রোবটের সেন্সর ডেটা পড়ার একটি পাইথন কোডিং ফাইল। এটি AI_Robotics_CS ফোল্ডারে যাবে।'
      },
    ]
  },
  3: {
    levelNumber: 3,
    title: "Level 3: ISO 8601 & Archiving (Class 8-9)",
    badge: "Class 8-9: Naming Conventions",
    goal: "Clean up confusing names (like 'final_v2_EDIT'). Move outdated revisions into '_Archive' and ensure current files follow the 'YYYY-MM-DD_Subject_v#' standard.",
    targetFolders: [
      { 
        id: 'f_active', 
        name: 'Current_Drafts', 
        icon: '📁', 
        accepted: ['active'],
        infoTitle: 'Current Drafts Folder',
        infoEn: 'Current Drafts: Holds active files following the ISO 8601 standard (YYYY-MM-DD_Subject_v#).',
        infoBn: 'সচল কাজের ফোল্ডার: এখানে নির্দিষ্ট তারিখ (YYYY-MM-DD) সহ সচল ও সঠিক ফাইল রাখা হয়।'
      },
      { 
        id: 'f_archive', 
        name: '_Archive', 
        icon: '📁', 
        accepted: ['archive'],
        infoTitle: '_Archive Folder',
        infoEn: 'Archive: Move outdated, superseded, confusingly-named revisions here so they do not clutter active work.',
        infoBn: 'আর্কাইভ ফোল্ডার: পুরনো, ভুল নামে সেভ করা বা বাতিল খসড়া ফাইলগুলো এখানে সরিয়ে রাখুন।'
      },
    ],
    files: [
      { 
        id: 'f3_1', 
        name: '2026-09-26_Robotics_Paper_v2.docx', 
        ext: 'docx', 
        size: '48 KB', 
        date: '2026-09-26', 
        targetFolderId: 'f_active', 
        preview: 'Final active draft following ISO standard timestamps.',
        infoTitle: 'Active Robotics Paper (Standard Named)',
        infoEn: 'Follows ISO 8601 date standard (YYYY-MM-DD) and clear versioning (v2). This is active, so it belongs in Current_Drafts.',
        infoBn: 'এতে আন্তর্জাতিক তারিখ ফরম্যাট (YYYY-MM-DD) ও ভার্সন রয়েছে। এটি সচল ফাইল, তাই Current_Drafts-এ যাবে।'
      },
      { 
        id: 'f3_2', 
        name: 'draft_rough_old_Robotics.docx', 
        ext: 'docx', 
        size: '18 KB', 
        date: '2026-08-10', 
        targetFolderId: 'f_archive', 
        preview: 'Superseded rough notes. Belongs in _Archive.',
        infoTitle: 'Old Rough Robotics Draft',
        infoEn: 'Has an unstandardized, confusing name and is an obsolete draft. It belongs in _Archive.',
        infoBn: 'এর নামটি অগোছালো এবং এটি একটি পুরনো খসড়া। এটি _Archive ফোল্ডারে রাখা উচিত।'
      },
      { 
        id: 'f3_3', 
        name: '2026-09-25_Quarterly_Budget_v1.xlsx', 
        ext: 'xlsx', 
        size: '20 KB', 
        date: '2026-09-25', 
        targetFolderId: 'f_active', 
        preview: 'Active budget table for Q3.',
        infoTitle: 'Active Quarterly Budget (Standard Named)',
        infoEn: 'Clean timestamped financial spreadsheet with clear version number (v1). It belongs in Current_Drafts.',
        infoBn: 'সঠিক তারিখ ও ভার্সন যুক্ত সচল বাজেট হিসাব। এটি Current_Drafts ফোল্ডারে যাবে।'
      },
      { 
        id: 'f3_4', 
        name: 'budget_trash_FINAL_2.xlsx', 
        ext: 'xlsx', 
        size: '15 KB', 
        date: '2026-07-02', 
        targetFolderId: 'f_archive', 
        preview: 'Old, chaotic name. Belongs in _Archive.',
        infoTitle: 'Superseded Budget (Messy Naming)',
        infoEn: 'Suffers from bad "FINAL_2" naming and is superseded by timestamped files. It belongs in _Archive.',
        infoBn: '"FINAL_2" নামের মতো অগোছালো ও বাতিল বাজেট ফাইল। এটি _Archive ফোল্ডারে পাঠাতে হবে।'
      },
      { 
        id: 'f3_5', 
        name: '2026-09-24_Conference_Keynote_v3.pptx', 
        ext: 'pptx', 
        size: '4.2 MB', 
        date: '2026-09-24', 
        targetFolderId: 'f_active', 
        preview: 'Active slide deck ready for delivery.',
        infoTitle: 'Active Conference Keynote (Standard Named)',
        infoEn: 'Latest conference slide deck correctly formatted with ISO date. It belongs in Current_Drafts.',
        infoBn: 'কনফারেন্সের আসল প্রেজেন্টেশন স্লাইড যা সঠিক তারিখে সাজানো। এটি Current_Drafts-এ যাবে।'
      },
      { 
        id: 'f3_6', 
        name: 'slides_bad_colors_DONT_USE.pptx', 
        ext: 'pptx', 
        size: '3.9 MB', 
        date: '2026-07-15', 
        targetFolderId: 'f_archive', 
        preview: 'Discarded slides with wrong palette.',
        infoTitle: 'Discarded Slide Deck ("DONT_USE")',
        infoEn: 'A discarded revision marked "DONT_USE" with bad color choices. It belongs in _Archive.',
        infoBn: 'ভুল রঙের বাতিল স্লাইড ("DONT_USE")। বিভ্রান্তি এড়াতে এটি _Archive ফোল্ডারে সরিয়ে রাখুন।'
      },
    ]
  },
  4: {
    levelNumber: 4,
    title: "Level 4: Studio Pipeline (Class 10-11)",
    badge: "Class 10-11: Studio Workflow",
    goal: "Separate raw immutable assets, work-in-progress project source files, and final client deliverables.",
    targetFolders: [
      { 
        id: 'f_raw', 
        name: '01_Raw_Assets', 
        icon: '📁', 
        accepted: ['raw'],
        infoTitle: '01_Raw_Assets Pipeline Folder',
        infoEn: 'Store untouched original camera shoots and field audio here. Never edit or overwrite raw assets!',
        infoBn: '০১ কাঁচা উপাদান: ক্যামেরা বা মাইকের মূল ফাইল এখানে রাখুন, যা কখনো সরাসরি কাটাছেঁড়া করা হয় না।'
      },
      { 
        id: 'f_work', 
        name: '02_Workings_Scripts', 
        icon: '📁', 
        accepted: ['workings'],
        infoTitle: '02_Workings_Scripts Pipeline Folder',
        infoEn: 'Store work-in-progress project files, editable timelines, and working scripts here.',
        infoBn: '০২ চলমান প্রজেক্ট: সম্পাদনার কাজ, ভিডিও এডিট টাইমলাইন ও চিত্রনাট্যের ড্রাফট এখানে রাখুন।'
      },
      { 
        id: 'f_deliv', 
        name: '03_Final_Deliverables', 
        icon: '📁', 
        accepted: ['deliverables'],
        infoTitle: '03_Final_Deliverables Pipeline Folder',
        infoEn: 'Store completed master exports and polished deliverables ready for clients, viewers, or release.',
        infoBn: '০৩ চূড়ান্ত ফলাফল: সম্পূর্ণ তৈরি হওয়া মাস্টার ভিডিও ও রিলিজের জন্য তৈরি ফাইল এখানে রাখুন।'
      },
    ],
    files: [
      { 
        id: 'f4_1', 
        name: 'Sony_A7_RAW_0042.jpeg', 
        ext: 'jpeg', 
        size: '12 MB', 
        date: '2026-09-12', 
        targetFolderId: 'f_raw', 
        preview: 'Uncompressed untouched camera sensor output.',
        infoTitle: 'Untouched Camera Sensor Output',
        infoEn: 'Original uncompressed capture directly from the camera sensor. Belongs in 01_Raw_Assets.',
        infoBn: 'ক্যামেরা সেন্সর থেকে আসা মূল অপরিবর্তিত ছবি। এটি 01_Raw_Assets ফোল্ডারে যাবে।'
      },
      { 
        id: 'f4_2', 
        name: 'Microphone_Interview_Raw.mp3', 
        ext: 'mp3', 
        size: '35 MB', 
        date: '2026-09-12', 
        targetFolderId: 'f_raw', 
        preview: 'Direct unedited dual-channel field recording.',
        infoTitle: 'Direct Field Audio Recording',
        infoEn: 'Direct unedited dual-channel field recording. Belongs in 01_Raw_Assets as raw source audio.',
        infoBn: 'সরাসরি রেকর্ড করা মূল ভয়েস অডিও। এটি 01_Raw_Assets ফোল্ডারে সুরক্ষিত থাকবে।'
      },
      { 
        id: 'f4_3', 
        name: 'Video_Editor_Timeline.pptx', 
        ext: 'pptx', 
        size: '2.1 MB', 
        date: '2026-09-15', 
        targetFolderId: 'f_work', 
        preview: 'Storyboards, cut timings, and transitions draft.',
        infoTitle: 'Video Editing Storyboard Timeline',
        infoEn: 'Work-in-progress editing layout, cut timings, and transitions. Belongs in 02_Workings_Scripts.',
        infoBn: 'ভিডিও এডিটের কাটাকাটি ও পরিকল্পনার চলমান কাজের ফাইল। এটি 02_Workings_Scripts-এ যাবে।'
      },
      { 
        id: 'f4_4', 
        name: 'Subtitle_Translation_Script.txt', 
        ext: 'txt', 
        size: '9 KB', 
        date: '2026-09-16', 
        targetFolderId: 'f_work', 
        preview: 'Working timestamps for English and Hindi closed captions.',
        infoTitle: 'Subtitle Translation Script',
        infoEn: 'Working subtitle draft with timestamps for translation. Belongs in 02_Workings_Scripts.',
        infoBn: 'অনুবাদ ও সাবটাইটেল লেখার চলমান ড্রাফট। এটি 02_Workings_Scripts ফোল্ডারে যাবে।'
      },
      { 
        id: 'f4_5', 
        name: 'Documentary_Master_4K.mp4', 
        ext: 'mp4', 
        size: '85 MB', 
        date: '2026-09-26', 
        targetFolderId: 'f_deliv', 
        preview: 'Color-graded, rendered final video ready for premiere.',
        infoTitle: '4K Master Rendered Video',
        infoEn: 'Color-graded, rendered master video deliverable ready to broadcast. Belongs in 03_Final_Deliverables.',
        infoBn: 'সম্পূর্ণ এডিট করা ৪কে মাস্টার ভিডিও যা রিলিজের জন্য প্রস্তুত। এটি 03_Final_Deliverables-এ যাবে।'
      },
      { 
        id: 'f4_6', 
        name: 'Press_Release_Distribution.pdf', 
        ext: 'pdf', 
        size: '890 KB', 
        date: '2026-09-26', 
        targetFolderId: 'f_deliv', 
        preview: 'Official signed press kit deliverable.',
        infoTitle: 'Official Press Release PDF',
        infoEn: 'Final signed press kit ready for media distribution. Belongs in 03_Final_Deliverables.',
        infoBn: 'মিডিয়ার জন্য চূড়ান্ত প্রেস রিলিজ ডকুমেন্ট। এটি 03_Final_Deliverables ফোল্ডারে যাবে।'
      },
    ]
  },
  5: {
    levelNumber: 5,
    title: "Level 5: AI Data Pipeline (Class 11 AI)",
    badge: "Class 11 AI: Data Architecture",
    goal: "Construct a professional Machine Learning project architecture: Unprocessed dirty data, cleaned feature datasets, model prompts & weights, and validation audit reports.",
    targetFolders: [
      { 
        id: 'f_dir_raw', 
        name: 'data_raw_unprocessed', 
        icon: '📁', 
        accepted: ['data_raw'],
        infoTitle: 'data_raw_unprocessed Pipeline Folder',
        infoEn: 'Contains uncleaned, scraped, or dirty source datasets with missing values and duplicates.',
        infoBn: 'অশোধিত ডেটা: ইন্টারনেট বা সার্ভার থেকে নেওয়া প্রাথমিক ডেটা, যাতে ভুল বা খালি তথ্য থাকতে পারে।'
      },
      { 
        id: 'f_dir_clean', 
        name: 'data_clean_training', 
        icon: '📁', 
        accepted: ['data_clean'],
        infoTitle: 'data_clean_training Pipeline Folder',
        infoEn: 'Contains cleaned, normalized, vectorized tables prepared for machine learning model training.',
        infoBn: 'পরিশোধিত ডেটা: মডেলকে শেখানোর উপযোগী পরিষ্কার, ফিল্টার করা ও প্রস্তুত ডেটাসেট।'
      },
      { 
        id: 'f_dir_model', 
        name: 'models_and_prompts', 
        icon: '📁', 
        accepted: ['models'],
        infoTitle: 'models_and_prompts Pipeline Folder',
        infoEn: 'Stores AI model weight checkpoints, architecture configurations, and system prompt engineering templates.',
        infoBn: 'মডেল ও প্রম্পট: কৃত্রিম বুদ্ধিমত্তা মডেলের ওজন (weights) ও সিস্টেম প্রম্পট কোড রাখার জায়গা।'
      },
      { 
        id: 'f_dir_eval', 
        name: 'reports_and_eval', 
        icon: '📁', 
        accepted: ['eval'],
        infoTitle: 'reports_and_eval Pipeline Folder',
        infoEn: 'Stores model validation metrics, F1 confusion matrices, accuracy graphs, and ethical audit papers.',
        infoBn: 'রিপোর্ট ও মূল্যায়ন: মডেলটি কতটুকু নির্ভুল ও নিরপেক্ষ তা যাচাই করার পরীক্ষার ফলাফল।'
      },
    ],
    files: [
      { 
        id: 'f5_1', 
        name: 'scraped_web_reviews_dirty.csv', 
        ext: 'xlsx', 
        size: '18 MB', 
        date: '2026-09-10', 
        targetFolderId: 'f_dir_raw', 
        preview: 'Raw HTML tags, duplicates, and unescaped quotes.',
        infoTitle: 'Scraped Web Reviews (Dirty Data)',
        infoEn: 'Raw web reviews containing HTML tags, missing rows, and duplicates. Belongs in data_raw_unprocessed.',
        infoBn: 'ইন্টারনেট থেকে সরাসরি নেওয়া অপরিশোধিত ডেটা যাতে ভুল মান রয়েছে। এটি data_raw_unprocessed-এ যাবে।'
      },
      { 
        id: 'f5_2', 
        name: 'training_dataset_normalized.xlsx', 
        ext: 'xlsx', 
        size: '8.4 MB', 
        date: '2026-09-20', 
        targetFolderId: 'f_dir_clean', 
        preview: 'Zero null values, tokenized strings, normalized vectors.',
        infoTitle: 'Normalized Training Dataset',
        infoEn: 'Cleaned, null-free, scaled feature vectors ready to train neural networks. Belongs in data_clean_training.',
        infoBn: 'খালি মানমুক্ত ও সংখ্যায় রূপান্তর করা প্রস্তুত ডেটা। এটি data_clean_training ফোল্ডারে যাবে।'
      },
      { 
        id: 'f5_3', 
        name: 'classifier_prompt_system.txt', 
        ext: 'txt', 
        size: '3 KB', 
        date: '2026-09-24', 
        targetFolderId: 'f_dir_model', 
        preview: 'You are an AI classifier. Label input tokens into sentiment classes.',
        infoTitle: 'AI System Classifier Prompt',
        infoEn: 'Core system instruction prompt that controls the LLM classifier behavior. Belongs in models_and_prompts.',
        infoBn: 'এআই মডেল কীভাবে উত্তর দেবে তার মূল নির্দেশক প্রম্পট। এটি models_and_prompts-এ যাবে।'
      },
      { 
        id: 'f5_4', 
        name: 'model_weights_checkpoint.pptx', 
        ext: 'pptx', 
        size: '45 MB', 
        date: '2026-09-25', 
        targetFolderId: 'f_dir_model', 
        preview: 'Serialized architecture weights and attention layers.',
        infoTitle: 'Model Weights Architecture Checkpoint',
        infoEn: 'Serialized trained neural network checkpoint and layer weights. Belongs in models_and_prompts.',
        infoBn: 'ট্রেন করা নিউরাল নেটওয়ার্কের ওজন ও স্থাপত্যের ফাইল। এটি models_and_prompts-এ যাবে।'
      },
      { 
        id: 'f5_5', 
        name: 'Confusion_Matrix_F1_Score.pdf', 
        ext: 'pdf', 
        size: '640 KB', 
        date: '2026-09-26', 
        targetFolderId: 'f_dir_eval', 
        preview: 'Test set precision: 96.4%, Recall: 95.1%, AUC: 0.98.',
        infoTitle: 'Model Evaluation & F1 Metric Report',
        infoEn: 'Official test benchmark report showing precision, recall, and F1 accuracy curves. Belongs in reports_and_eval.',
        infoBn: 'মডেলের কাজের নির্ভুলতা ও এফ-১ স্কোর যাচাইয়ের রেজাল্ট শিট। এটি reports_and_eval-এ যাবে।'
      },
      { 
        id: 'f5_6', 
        name: 'Model_Ethical_Bias_Audit.docx', 
        ext: 'docx', 
        size: '55 KB', 
        date: '2026-09-26', 
        targetFolderId: 'f_dir_eval', 
        preview: 'Fairness metric evaluation across diverse demographic test cohorts.',
        infoTitle: 'AI Ethical Bias & Fairness Audit',
        infoEn: 'Document evaluating model fairness and mitigation of bias across demographics. Belongs in reports_and_eval.',
        infoBn: 'এআই মডেলে কোনো পক্ষপাতিত্ব আছে কিনা তা নিরীক্ষার অডিট রিপোর্ট। এটি reports_and_eval-এ যাবে।'
      },
    ]
  }
};

// ==========================================
// TRACK 2: FOLDER MANAGEMENT (7 LEVELS)
// ==========================================
export const FOLDER_MANAGEMENT_LEVELS: Record<number, FolderManagementLevel> = {
  1: {
    levelNumber: 1,
    title: "Level 1: Creation & Cleanup Basics (Class 3-4)",
    badge: "Class 3-4: Folder Basics",
    goal: "Create standard media folders in your workspace: 'Photos', 'Homework', 'Music', and 'Projects'. Delete clutter/junk folders like 'New Folder (1)' and 'temp_junk_delete_me' to the Recycle Bin.",
    instructions: [
      "Click '➕ New folder' on the ribbon to create 'Photos', 'Homework', 'Music', and 'Projects'.",
      "Select 'New Folder (1)' and 'temp_junk_delete_me' and press Delete (or click 🗑️ Delete) to send them to the Recycle Bin.",
      "Check with Dita AI Copilot to verify all required folders exist and junk is removed."
    ],
    initialFolders: [
      {
        id: 'junk_1',
        name: 'New Folder (1)',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Accidental Duplicate Folder',
        infoEn: 'An accidental empty folder created without a name. Should be deleted to keep workspace tidy.',
        infoBn: 'ভুলবশত তৈরি হওয়া নামহীন ফাঁকা ফোল্ডার। এটি মুছে রিসাইকেল বিনে পাঠান।'
      },
      {
        id: 'junk_2',
        name: 'temp_junk_delete_me',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Temporary Junk Folder',
        infoEn: 'Temporary trash folder that clutters the root directory. Delete to Recycle Bin.',
        infoBn: 'অপ্রয়োজনীয় অপ্রাসঙ্গিক আবর্জনা ফোল্ডার। এটি ডিলিট করতে হবে।'
      }
    ],
    junkFolderNamesToDelete: ['New Folder (1)', 'temp_junk_delete_me'],
    expectedTree: [
      {
        name: 'Photos',
        path: 'Photos',
        infoTitle: 'Photos Folder',
        infoEn: 'Stores family and personal digital photo albums.',
        infoBn: 'ব্যক্তিগত ও পারিবারিক সব ডিজিটাল ছবি রাখার ফোল্ডার।'
      },
      {
        name: 'Homework',
        path: 'Homework',
        infoTitle: 'Homework Folder',
        infoEn: 'Stores school homework, class tasks, and worksheets.',
        infoBn: 'স্কুলের বাড়ির কাজ ও অ্যাসাইনমেন্টের ফাইল রাখার প্রধান ফোল্ডার।'
      },
      {
        name: 'Music',
        path: 'Music',
        infoTitle: 'Music Folder',
        infoEn: 'Stores music MP3 tracks, voice recordings, and podcasts.',
        infoBn: 'গান ও অন্যান্য অডিও ফাইল সংরক্ষণের ফোল্ডার।'
      },
      {
        name: 'Projects',
        path: 'Projects',
        infoTitle: 'Projects Folder',
        infoEn: 'Stores creative arts, science crafts, and computer tasks.',
        infoBn: 'সৃজনশীল আর্ট, বিজ্ঞান মেলা ও কম্পিউটারের প্রজেক্ট রাখার ফোল্ডার।'
      }
    ],
    bilingualGuide: {
      en: "Learn fundamental folder creation and deletion. A tidy computer has dedicated category folders and zero junk.",
      bn: "কম্পিউটারে নতুন ফোল্ডার তৈরি এবং অপ্রয়োজনীয় ফোল্ডার মুছে রিসাইকেল বিনে পাঠানোর প্রাথমিক দক্ষতা অর্জন করুন।"
    }
  },

  2: {
    levelNumber: 2,
    title: "Level 2: Subfolder Nesting & Renaming (Class 5-6)",
    badge: "Class 5-6: Subfolder Nesting",
    goal: "Create a root directory 'School_Work'. Inside 'School_Work', create subfolders: 'Term_1', 'Term_2', 'Exams', and 'Assignments'. Rename the existing messy 'Untitled_Folder' to 'Assignments'.",
    instructions: [
      "Ensure 'School_Work' folder exists in root.",
      "Double click into 'School_Work' and create subfolders: 'Term_1', 'Term_2', and 'Exams'.",
      "Rename 'Untitled_Folder' to 'Assignments' using F2 or the ✏️ Rename button.",
      "Move or place 'Assignments' inside 'School_Work'."
    ],
    initialFolders: [
      {
        id: 'f2_misnamed',
        name: 'Untitled_Folder',
        parentId: 'root',
        needsRenameTo: 'Assignments',
        infoTitle: 'Misnamed Folder',
        infoEn: 'This folder was left with a generic name. Rename it to "Assignments" using F2 or the Rename tool.',
        infoBn: 'অস্পষ্ট নামের ফোল্ডার। F2 চেপে বা রিনেম বোতাম দিয়ে এর নাম পরিবর্তন করে "Assignments" রাখুন।'
      }
    ],
    renamedFoldersExpected: [
      { originalIdOrName: 'Untitled_Folder', expectedName: 'Assignments' }
    ],
    expectedTree: [
      {
        name: 'School_Work',
        path: 'School_Work',
        infoTitle: 'School Work Parent Directory',
        infoEn: 'Top-level container for all annual academic schoolwork.',
        infoBn: 'সারা বছরের একাডেমিক পড়াশোনা ও পরীক্ষার মূল মূল-ফোল্ডার।',
        children: [
          {
            name: 'Term_1',
            path: 'School_Work/Term_1',
            infoTitle: 'Term 1 Subfolder',
            infoEn: 'Holds curriculum chapters, notes, and tests for the first academic term.',
            infoBn: 'প্রথম সাময়িক পরীক্ষার যাবতীয় পড়া ও নোট রাখার সাব-ফোল্ডার।'
          },
          {
            name: 'Term_2',
            path: 'School_Work/Term_2',
            infoTitle: 'Term 2 Subfolder',
            infoEn: 'Holds curriculum chapters, notes, and tests for the second academic term.',
            infoBn: 'দ্বিতীয় সাময়িক পরীক্ষার পড়া ও ক্লাসের নোট রাখার সাব-ফোল্ডার।'
          },
          {
            name: 'Exams',
            path: 'School_Work/Exams',
            infoTitle: 'Exams Subfolder',
            infoEn: 'Holds revision sample question papers and revision sheets.',
            infoBn: 'বার্ষিক পরীক্ষা ও মক টেস্টের প্রশ্নপত্র সংরক্ষণের সাব-ফোল্ডার।'
          },
          {
            name: 'Assignments',
            path: 'School_Work/Assignments',
            infoTitle: 'Assignments Subfolder',
            infoEn: 'Holds evaluated project assignments submitted to teachers.',
            infoBn: 'শিক্ষকদের জমা দেওয়া বিভিন্ন বিষয়ের অ্যাসাইনমেন্টের সাব-ফোল্ডার।'
          }
        ]
      }
    ],
    bilingualGuide: {
      en: "Learn how to nest subfolders inside parent directories and rename folders with meaningful descriptions.",
      bn: "মূল ফোল্ডারের ভেতর সাব-ফোল্ডার তৈরি করা এবং ফোল্ডারের নাম পরিবর্তন (Rename) করার নিয়ম শিখুন।"
    }
  },

  3: {
    levelNumber: 3,
    title: "Level 3: Multi-Tier Departmental Tree (Class 7-8)",
    badge: "Class 7-8: Hierarchy Tree",
    goal: "Construct a 3-tier deep curriculum structure: Root 'Academics' containing 'Science' (subfolders: 'Physics', 'Chemistry', 'Biology'), 'Commerce' (subfolders: 'Accounting', 'Economics'), and 'Humanities' (subfolders: 'History', 'Geography'). Delete empty duplicate 'test_copy_delete'.",
    instructions: [
      "In Workspace Root, create 'Academics'.",
      "Inside 'Academics', create 3 faculty folders: 'Science', 'Commerce', and 'Humanities'.",
      "Inside 'Science', create 'Physics', 'Chemistry', and 'Biology'.",
      "Inside 'Commerce', create 'Accounting' and 'Economics'.",
      "Inside 'Humanities', create 'History' and 'Geography'.",
      "Delete 'test_copy_delete' to Recycle Bin."
    ],
    initialFolders: [
      {
        id: 'f3_junk',
        name: 'test_copy_delete',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Redundant Test Folder',
        infoEn: 'An abandoned test folder. Delete to the Recycle Bin.',
        infoBn: 'একটি পরিত্যক্ত টেস্ট ফোল্ডার। এটি রিসাইকেল বিনে পাঠান।'
      }
    ],
    junkFolderNamesToDelete: ['test_copy_delete'],
    expectedTree: [
      {
        name: 'Academics',
        path: 'Academics',
        infoTitle: 'Academics Faculty Directory',
        infoEn: 'Top-tier master directory encompassing all educational streams.',
        infoBn: 'সকল শিক্ষাগত শাখা ও বিভাগের কেন্দ্রীয় মূল ফোল্ডার।',
        children: [
          {
            name: 'Science',
            path: 'Academics/Science',
            infoTitle: 'Science Stream',
            infoEn: 'Contains STEM disciplines and laboratory sciences.',
            infoBn: 'বিজ্ঞান বিভাগের সব শাখার ফোল্ডার।',
            children: [
              { name: 'Physics', path: 'Academics/Science/Physics', infoTitle: 'Physics Dept', infoEn: 'Mechanics, optics, and thermodynamics.', infoBn: 'পদার্থবিজ্ঞান বিষয়ের ফোল্ডার।' },
              { name: 'Chemistry', path: 'Academics/Science/Chemistry', infoTitle: 'Chemistry Dept', infoEn: 'Organic, inorganic, and practical titration.', infoBn: 'রসায়ন বিষয়ের ফোল্ডার।' },
              { name: 'Biology', path: 'Academics/Science/Biology', infoTitle: 'Biology Dept', infoEn: 'Botany, zoology, and genetics.', infoBn: 'জীববিজ্ঞান বিষয়ের ফোল্ডার।' }
            ]
          },
          {
            name: 'Commerce',
            path: 'Academics/Commerce',
            infoTitle: 'Commerce Stream',
            infoEn: 'Business studies, accounting, and financial management.',
            infoBn: 'বাণিজ্য বিভাগের সব বিষয়ের ফোল্ডার।',
            children: [
              { name: 'Accounting', path: 'Academics/Commerce/Accounting', infoTitle: 'Accounting', infoEn: 'Ledgers, double-entry, and balance sheets.', infoBn: 'হিসাববিজ্ঞান ফোল্ডার।' },
              { name: 'Economics', path: 'Academics/Commerce/Economics', infoTitle: 'Economics', infoEn: 'Micro, macro, and market graphs.', infoBn: 'অর্থনীতি বিষয়ের ফোল্ডার।' }
            ]
          },
          {
            name: 'Humanities',
            path: 'Academics/Humanities',
            infoTitle: 'Humanities Stream',
            infoEn: 'Social sciences, historical archives, and world cultures.',
            infoBn: 'মানবিক ও সমাজবিজ্ঞান শাখার ফোল্ডার।',
            children: [
              { name: 'History', path: 'Academics/Humanities/History', infoTitle: 'History', infoEn: 'World chronicles, civilizations, and revolutions.', infoBn: 'ইতিহাস বিষয়ের ফোল্ডার।' },
              { name: 'Geography', path: 'Academics/Humanities/Geography', infoTitle: 'Geography', infoEn: 'Cartography, climate, and topography.', infoBn: 'ভূগোল বিষয়ের ফোল্ডার।' }
            ]
          }
        ]
      }
    ],
    bilingualGuide: {
      en: "Build a multi-tier branch tree hierarchy. Organizing by Stream -> Department -> Subject prevents clutter across large institutions.",
      bn: "বহু-স্তরীয় শাখা ফোল্ডার তৈরি করুন। বড় প্রতিষ্ঠানে বিষয়ভিত্তিক স্তরবিন্যাস কাজের গতি বাড়ায়।"
    }
  },

  4: {
    levelNumber: 4,
    title: "Level 4: Corporate Departmental Tree (Class 9-10)",
    badge: "Class 9-10: Corporate Admin",
    goal: "Construct an official enterprise office directory 'Company_HQ': Human_Resources ('Onboarding', 'Payroll', 'Leave_Records'), Finance_Accounts ('Invoices_2026', 'Tax_Audits', 'Budgets'), and Operations ('Logistics', 'Vendor_Contracts'). Rename 'old_hr_stuff' to 'HR_Archives'.",
    instructions: [
      "In Workspace Root, create 'Company_HQ'.",
      "Inside 'Company_HQ', build 3 corporate divisions: 'Human_Resources', 'Finance_Accounts', and 'Operations'.",
      "Under 'Human_Resources', create 'Onboarding', 'Payroll', 'Leave_Records', and move the renamed 'HR_Archives' here.",
      "Under 'Finance_Accounts', create 'Invoices_2026', 'Tax_Audits', and 'Budgets'.",
      "Under 'Operations', create 'Logistics' and 'Vendor_Contracts'.",
      "Delete 'corrupt_temp_cache' to Recycle Bin."
    ],
    initialFolders: [
      {
        id: 'f4_old_hr',
        name: 'old_hr_stuff',
        parentId: 'root',
        needsRenameTo: 'HR_Archives',
        infoTitle: 'Legacy HR Folder',
        infoEn: 'Legacy human resources folder. Rename to "HR_Archives" and organize under Human_Resources.',
        infoBn: 'পুরনো এইচআর ফোল্ডার। এর নাম পরিবর্তন করে "HR_Archives" রাখুন এবং Human_Resources ফোল্ডারে রাখুন।'
      },
      {
        id: 'f4_junk',
        name: 'corrupt_temp_cache',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Corrupt Temporary Cache',
        infoEn: 'Corrupt temporary application cache. Delete to the Recycle Bin.',
        infoBn: 'ক্ষতিগ্রস্ত অস্থায়ী ক্যাশ ফোল্ডার। এটি অবিলম্বে মুছে রিসাইকেল বিনে পাঠান।'
      }
    ],
    junkFolderNamesToDelete: ['corrupt_temp_cache'],
    renamedFoldersExpected: [
      { originalIdOrName: 'old_hr_stuff', expectedName: 'HR_Archives' }
    ],
    expectedTree: [
      {
        name: 'Company_HQ',
        path: 'Company_HQ',
        infoTitle: 'Company Headquarters Root',
        infoEn: 'Master administrative enterprise root container.',
        infoBn: 'কোম্পানির সকল দাপ্তরিক শাখার কেন্দ্রীয় হেডকোয়ার্টার ফোল্ডার।',
        children: [
          {
            name: 'Human_Resources',
            path: 'Company_HQ/Human_Resources',
            infoTitle: 'HR Department',
            infoEn: 'Staff management, personnel files, and compliance.',
            infoBn: 'মানবসম্পদ (এইচআর) ব্যবস্থাপনা বিভাগ।',
            children: [
              { name: 'Onboarding', path: 'Company_HQ/Human_Resources/Onboarding', infoTitle: 'New Hire Onboarding', infoEn: 'Employee induction and ID dossiers.', infoBn: 'নতুন কর্মীদের যোগদান ও পরিচয়পত্র নথি।' },
              { name: 'Payroll', path: 'Company_HQ/Human_Resources/Payroll', infoTitle: 'Staff Payroll', infoEn: 'Monthly salary disbursements and allowances.', infoBn: 'মাসিক বেতন ও ভাতার ফাইল।' },
              { name: 'Leave_Records', path: 'Company_HQ/Human_Resources/Leave_Records', infoTitle: 'Leave Records', infoEn: 'Vacation, sick leave, and attendance trackers.', infoBn: 'ছুটি ও উপস্থিতির রেকর্ড।' },
              { name: 'HR_Archives', path: 'Company_HQ/Human_Resources/HR_Archives', infoTitle: 'HR Archives', infoEn: 'Former staff historical records.', infoBn: 'সাবেক কর্মীদের পুরনো সংরক্ষিত নথি।' }
            ]
          },
          {
            name: 'Finance_Accounts',
            path: 'Company_HQ/Finance_Accounts',
            infoTitle: 'Finance & Accounts',
            infoEn: 'Fiscal audits, tax filings, and budgeting.',
            infoBn: 'অর্থ ও হিসাবরক্ষণ বিভাগ।',
            children: [
              { name: 'Invoices_2026', path: 'Company_HQ/Finance_Accounts/Invoices_2026', infoTitle: '2026 Invoices', infoEn: 'Client billings and payment receipts.', infoBn: 'গ্রাহকের ইনভয়েস ও রসিদ।' },
              { name: 'Tax_Audits', path: 'Company_HQ/Finance_Accounts/Tax_Audits', infoTitle: 'Tax & Auditing', infoEn: 'GST, TDS, and statutory balance sheets.', infoBn: 'ট্যাক্স অডিট ও আয়কর ফাইল।' },
              { name: 'Budgets', path: 'Company_HQ/Finance_Accounts/Budgets', infoTitle: 'Annual Budgets', infoEn: 'Departmental expenditure allocations.', infoBn: 'বিভাগীয় বার্ষিক বাজেট।' }
            ]
          },
          {
            name: 'Operations',
            path: 'Company_HQ/Operations',
            infoTitle: 'Operations & Logistics',
            infoEn: 'Supply chain, procurement, and site management.',
            infoBn: 'অপারেশনস ও সাপ্লাই চেইন বিভাগ।',
            children: [
              { name: 'Logistics', path: 'Company_HQ/Operations/Logistics', infoTitle: 'Logistics & Fleet', infoEn: 'Shipping routes, couriers, and inventory movement.', infoBn: 'পণ্য পরিবহন ও লজিস্টিকস।' },
              { name: 'Vendor_Contracts', path: 'Company_HQ/Operations/Vendor_Contracts', infoTitle: 'Vendor Contracts', infoEn: 'Supplier agreements and SLAs.', infoBn: 'সরবরাহকারী চুক্তিপত্র ও এগ্রিমেন্ট।' }
            ]
          }
        ]
      }
    ],
    bilingualGuide: {
      en: "Standard enterprise folder governance. Proper separation of HR, Finance, and Operations guarantees compliance and access security.",
      bn: "কর্পোরেট অফিসের ফোল্ডার আর্কিটেকচার। এইচআর, অর্থ ও অপারেশন আলাদা রাখা নিরাপত্তা ও নিয়মানুবর্তিতার জন্য জরুরি।"
    }
  },

  5: {
    levelNumber: 5,
    title: "Level 5: Software & Web Project Architecture (Class 10-11)",
    badge: "Class 10-11: Web DevOps",
    goal: "Construct a professional production web app codebase structure: Root 'Web_Project' with 'src' (subfolders: 'components', 'services', 'types', 'assets'), 'public' (subfolders: 'images', 'fonts'), and 'docs' (subfolders: 'api_specs', 'changelogs'). Delete 'temp_build_cache' and 'scratch_junk'.",
    instructions: [
      "In Workspace Root, create 'Web_Project'.",
      "Inside 'Web_Project', create 3 standard codebase directories: 'src', 'public', and 'docs'.",
      "Inside 'src', create 'components', 'services', 'types', and 'assets'.",
      "Inside 'public', create 'images' and 'fonts'.",
      "Inside 'docs', create 'api_specs' and 'changelogs'.",
      "Delete 'temp_build_cache' and 'scratch_junk' to the Recycle Bin."
    ],
    initialFolders: [
      {
        id: 'f5_junk1',
        name: 'temp_build_cache',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Temporary Build Cache',
        infoEn: 'Temporary compiled cache artifacts. Delete to keep repository clean.',
        infoBn: 'অস্থায়ী বিল্ড ক্যাশ ফাইল। গিট রিপোজিটরি পরিষ্কার রাখতে এটি ডিলিট করুন।'
      },
      {
        id: 'f5_junk2',
        name: 'scratch_junk',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Scratch Junk',
        infoEn: 'Scratchpad notes that must not enter production. Delete to Recycle Bin.',
        infoBn: 'অগোছালো ড্রাফট ফাইল যা প্রোডাকশনে যাওয়া নিষিদ্ধ। এটি মুছে ফেলুন।'
      }
    ],
    junkFolderNamesToDelete: ['temp_build_cache', 'scratch_junk'],
    expectedTree: [
      {
        name: 'Web_Project',
        path: 'Web_Project',
        infoTitle: 'Web Project Root',
        infoEn: 'Application repository root directory.',
        infoBn: 'ওয়েব অ্যাপ্লিকেশন প্রজেক্টের মূল সোর্স ডিরেক্টরি।',
        children: [
          {
            name: 'src',
            path: 'Web_Project/src',
            infoTitle: 'Source Code Directory',
            infoEn: 'Core JavaScript/TypeScript and React modules.',
            infoBn: 'অ্যাপ্লিকেশনের মূল প্রোগ্রামিং সোর্স কোড ফোল্ডার।',
            children: [
              { name: 'components', path: 'Web_Project/src/components', infoTitle: 'UI Components', infoEn: 'Reusable buttons, navbars, cards, and modal dialogs.', infoBn: 'ইউজার ইন্টারফেসের কম্পোনেন্টসমূহ।' },
              { name: 'services', path: 'Web_Project/src/services', infoTitle: 'API Services', infoEn: 'Backend API callers, state handlers, and storage.', infoBn: 'সার্ভার যোগাযোগ ও ডেটা সার্ভিস।' },
              { name: 'types', path: 'Web_Project/src/types', infoTitle: 'TypeScript Types', infoEn: 'Data models, schema definitions, and interfaces.', infoBn: 'টাইপস্ক্রিপ্ট টাইপ ও ইন্টারফেস ফাইল।' },
              { name: 'assets', path: 'Web_Project/src/assets', infoTitle: 'App Assets', infoEn: 'Bundled SVG icons, styles, and animation vectors.', infoBn: 'আইকন ও গ্রাফিক্স অ্যাসেট।' }
            ]
          },
          {
            name: 'public',
            path: 'Web_Project/public',
            infoTitle: 'Public Static Assets',
            infoEn: 'Unbundled static assets served directly by the web server.',
            infoBn: 'সার্ভার থেকে সরাসরি লোড হওয়া স্ট্যাটিক ফাইল ফোল্ডার।',
            children: [
              { name: 'images', path: 'Web_Project/public/images', infoTitle: 'Public Images', infoEn: 'High-res banners, logos, and favicons.', infoBn: 'লোগো ও ব্যানার ছবির ফোল্ডার।' },
              { name: 'fonts', path: 'Web_Project/public/fonts', infoTitle: 'Web Fonts', infoEn: 'Custom WOFF2 and TTF web font typographies.', infoBn: 'ওয়েবসাইট ফন্ট টাইপোগ্রাফি ফোল্ডার।' }
            ]
          },
          {
            name: 'docs',
            path: 'Web_Project/docs',
            infoTitle: 'Technical Documentation',
            infoEn: 'Engineering specifications, architecture diagrams, and release logs.',
            infoBn: 'প্রকৌশল ও কারিগরি ডকুমেন্টেশন ডিরেক্টরি।',
            children: [
              { name: 'api_specs', path: 'Web_Project/docs/api_specs', infoTitle: 'REST API Specs', infoEn: 'OpenAPI Swagger endpoints and payload schemas.', infoBn: 'রেস্ট এপিআই স্পেসিফিকেশন নথি।' },
              { name: 'changelogs', path: 'Web_Project/docs/changelogs', infoTitle: 'Release Changelogs', infoEn: 'Version histories, bug fixes, and feature notes.', infoBn: 'প্রতিটি ভার্সনের আপডেট ও পরিবর্তন তালিকা।' }
            ]
          }
        ]
      }
    ],
    bilingualGuide: {
      en: "Software development industry standard structure (Vite/React/Next.js conventions). Clean modular separation between source code, public assets, and documentation.",
      bn: "আন্তর্জাতিক সফটওয়্যার আর্কিটেকচার মান। কোড (src), পাবলিক ফাইল (public) ও কারিগরি তথ্যের (docs) নিয়মমাফিক বিভাজন।"
    }
  },

  6: {
    levelNumber: 6,
    title: "Level 6: Media Studio & Production Pipeline (Class 11-12)",
    badge: "Class 11-12: Studio Pipeline",
    goal: "Construct a numbered sequence studio workflow: Root 'Film_Production' with '01_Pre_Production' ('Scripts', 'Storyboards', 'Casting'), '02_Production' ('Camera_A', 'Camera_B', 'Audio_Stems'), '03_Post_Production' ('VFX_Comps', 'Color_Grade', 'Sound_Mix'), and '04_Exports' ('ProRes_Masters', 'Web_H264'). Delete 'random_shots_delete' and 'test_renders_old'.",
    instructions: [
      "In Workspace Root, create 'Film_Production'.",
      "Inside 'Film_Production', build 4 numbered pipeline stages: '01_Pre_Production', '02_Production', '03_Post_Production', '04_Exports'.",
      "Under '01_Pre_Production', create 'Scripts', 'Storyboards', and 'Casting'.",
      "Under '02_Production', create 'Camera_A', 'Camera_B', and 'Audio_Stems'.",
      "Under '03_Post_Production', create 'VFX_Comps', 'Color_Grade', and 'Sound_Mix'.",
      "Under '04_Exports', create 'ProRes_Masters' and 'Web_H264'.",
      "Delete 'random_shots_delete' and 'test_renders_old' to Recycle Bin."
    ],
    initialFolders: [
      {
        id: 'f6_junk1',
        name: 'random_shots_delete',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Random Outtake Footage',
        infoEn: 'Blurry outtakes that failed quality check. Delete to Recycle Bin.',
        infoBn: 'নষ্ট ও ঘোলা ফুটেজের ফোল্ডার। এটি রিসাইকেল বিনে পাঠান।'
      },
      {
        id: 'f6_junk2',
        name: 'test_renders_old',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Obsolete Test Renders',
        infoEn: 'Superseded render drafts consuming storage. Delete to Recycle Bin.',
        infoBn: 'বাতিল হওয়া পুরনো রেন্ডার ফাইল যা জায়গা নষ্ট করছে। এটি মুছে ফেলুন।'
      }
    ],
    junkFolderNamesToDelete: ['random_shots_delete', 'test_renders_old'],
    expectedTree: [
      {
        name: 'Film_Production',
        path: 'Film_Production',
        infoTitle: 'Film Production Master Directory',
        infoEn: 'Studio broadcast project master directory with ISO-ordered stages.',
        infoBn: 'চলচ্চিত্র ও ভিডিও স্টুডিওর ধারাবাহিক পর্যায়ভিত্তিক মূল ফোল্ডার।',
        children: [
          {
            name: '01_Pre_Production',
            path: 'Film_Production/01_Pre_Production',
            infoTitle: 'Stage 01: Pre-Production',
            infoEn: 'Concept arts, screenplays, scheduling, and audition reels.',
            infoBn: '০১ প্রাক-প্রযোজনা: চিত্রনাট্য, শ্যুটিং পরিকল্পনা ও কাস্টিং নথি।',
            children: [
              { name: 'Scripts', path: 'Film_Production/01_Pre_Production/Scripts', infoTitle: 'Screenplay Scripts', infoEn: 'Dialogue revisions and scene descriptions.', infoBn: 'নাটক বা সিনেমার চিত্রনাট্য।' },
              { name: 'Storyboards', path: 'Film_Production/01_Pre_Production/Storyboards', infoTitle: 'Visual Storyboards', infoEn: 'Shot lists and concept camera sketches.', infoBn: 'ক্যামেরা অ্যাঙ্গেলের স্কেচ ও স্টোরিবোর্ড।' },
              { name: 'Casting', path: 'Film_Production/01_Pre_Production/Casting', infoTitle: 'Actor Casting', infoEn: 'Talent contracts and audition tapes.', infoBn: 'অভিনয়শিল্পীদের চুক্তি ও অডিশন ফাইল।' }
            ]
          },
          {
            name: '02_Production',
            path: 'Film_Production/02_Production',
            infoTitle: 'Stage 02: Production Shoots',
            infoEn: 'Live shoot footage, dual-system microphones, and boom audio.',
            infoBn: '০২ শ্যুটিং পর্যায়: ক্যামেরা ও সাউন্ড রেকর্ডিংয়ের মূল ফাইল।',
            children: [
              { name: 'Camera_A', path: 'Film_Production/02_Production/Camera_A', infoTitle: 'Camera A (Main 4K)', infoEn: 'Primary cinema camera raw sensor cards.', infoBn: 'প্রধান ৪কে ক্যামেরার মূল ফুটেজ।' },
              { name: 'Camera_B', path: 'Film_Production/02_Production/Camera_B', infoTitle: 'Camera B (B-Roll)', infoEn: 'Secondary close-up and gimbal camera cards.', infoBn: 'সহকারী ক্যামেরা ও বি-রোল ফুটেজ।' },
              { name: 'Audio_Stems', path: 'Film_Production/02_Production/Audio_Stems', infoTitle: 'Multi-Track Audio', infoEn: 'Multichannel 32-bit float audio recordings.', infoBn: 'উচ্চমানের বহু-চ্যানেল অডিও রেকর্ডিং।' }
            ]
          },
          {
            name: '03_Post_Production',
            path: 'Film_Production/03_Post_Production',
            infoTitle: 'Stage 03: Post-Production',
            infoEn: 'Visual effects, color timing, dialogue cleanup, and score mixing.',
            infoBn: '০৩ পোস্ট-প্রোডাকশন: ভিজ্যুয়াল ইফেক্ট, কালার গ্রেডিং ও সাউন্ড মিক্স।',
            children: [
              { name: 'VFX_Comps', path: 'Film_Production/03_Post_Production/VFX_Comps', infoTitle: 'Visual Effects (VFX)', infoEn: 'CGI renders, green screen mattes, and compositing.', infoBn: 'কম্পিউটার গ্রাফিক্স ও স্পেশাল ইফেক্ট।' },
              { name: 'Color_Grade', path: 'Film_Production/03_Post_Production/Color_Grade', infoTitle: 'Color Grading', infoEn: 'DaVinci Resolve LUTs and cinematic palettes.', infoBn: 'সিনেমাটিক কালার গ্রেডিং ও রঙের কাজ।' },
              { name: 'Sound_Mix', path: 'Film_Production/03_Post_Production/Sound_Mix', infoTitle: 'Final Sound Mix', infoEn: 'Foley, ambient soundtrack, and surround mixes.', infoBn: 'ব্যাকগ্রাউন্ড মিউজিক ও সাউন্ড ডিজাইন।' }
            ]
          },
          {
            name: '04_Exports',
            path: 'Film_Production/04_Exports',
            infoTitle: 'Stage 04: Master Deliverables',
            infoEn: 'Broadcast exports, digital cinema packages, and web streaming files.',
            infoBn: '০৪ ফাইনাল এক্সপোর্ট: সম্প্রচার ও ইন্টারনেটে প্রকাশের চূড়ান্ত ফাইল।',
            children: [
              { name: 'ProRes_Masters', path: 'Film_Production/04_Exports/ProRes_Masters', infoTitle: 'ProRes 4444 Master', infoEn: 'Lossless uncompressed master for theater cinema.', infoBn: 'সিনেমা হলের জন্য মাস্টার কোয়ালিটি ভিডিও।' },
              { name: 'Web_H264', path: 'Film_Production/04_Exports/Web_H264', infoTitle: 'Web Compressed H.264', infoEn: 'Compressed MP4 for YouTube, social media, and web.', infoBn: 'ইউটিউব ও সোশ্যাল মিডিয়ার জন্য কমপ্রেসড ভিডিও।' }
            ]
          }
        ]
      }
    ],
    bilingualGuide: {
      en: "Professional Hollywood / studio numbering convention ('01_', '02_', '03_'). Numbering forces operating systems to sort folders in logical workflow order rather than alphabetical order.",
      bn: "পেশাদার মিডিয়া স্টুডিওতে ক্রমানুযায়ী সংখ্যাযুক্ত ফোল্ডার ('০১_', '০২_') ব্যবহৃত হয়, যাতে কম্পিউটার কাজের ধাপ অনুযায়ী এগুলো সাজায়।"
    }
  },

  7: {
    levelNumber: 7,
    title: "Level 7: Enterprise Cloud / Datacenter Infrastructure (Class 12 / Pro)",
    badge: "Professional: Cloud Architecture",
    goal: "Construct a mission-critical cloud infrastructure hierarchy: Root 'Cloud_Infrastructure' with 'Environments' ('Production' with 'App_Cluster', 'Database_Replica', 'SSL_Certs'; 'Staging' with 'QA_Tests', 'Pre_Release'; 'Development' with 'Local_Containers', 'Sandbox'), 'Backups' ('Daily_Snapshots', 'Disaster_Recovery'), and 'Security_Audits' ('Access_Logs_2026', 'Penetration_Reports'). Delete security hazards 'unsecured_dump' and 'test_keys_leak'.",
    instructions: [
      "In Workspace Root, create 'Cloud_Infrastructure'.",
      "Inside 'Cloud_Infrastructure', create 3 core tiers: 'Environments', 'Backups', and 'Security_Audits'.",
      "Under 'Environments', create 3 deployment stages: 'Production', 'Staging', and 'Development'.",
      "Under 'Environments/Production', create 'App_Cluster', 'Database_Replica', and 'SSL_Certs'.",
      "Under 'Environments/Staging', create 'QA_Tests' and 'Pre_Release'.",
      "Under 'Environments/Development', create 'Local_Containers' and 'Sandbox'.",
      "Under 'Backups', create 'Daily_Snapshots' and 'Disaster_Recovery'.",
      "Under 'Security_Audits', create 'Access_Logs_2026' and 'Penetration_Reports'.",
      "Delete compromised hazard folders 'unsecured_dump' and 'test_keys_leak' to Recycle Bin."
    ],
    initialFolders: [
      {
        id: 'f7_leak1',
        name: 'unsecured_dump',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Unsecured Data Dump (Hazard)',
        infoEn: 'Critical compliance violation: Unencrypted database dump left exposed. Must be deleted immediately.',
        infoBn: 'মারাত্মক নিরাপত্তা ঝুঁকি: উন্মুক্ত পাসওয়ার্ড ও ডেটা ডাম্প। এটি তৎক্ষণাৎ মুছে রিসাইকেল বিনে পাঠান।'
      },
      {
        id: 'f7_leak2',
        name: 'test_keys_leak',
        parentId: 'root',
        isJunk: true,
        infoTitle: 'Leaked API Keys (Hazard)',
        infoEn: 'Critical compliance violation: Plaintext private API keys exposed on disk. Delete immediately.',
        infoBn: 'মারাত্মক নিরাপত্তা ত্রুটি: উন্মুক্ত এপিআই কি ও প্রাইভেট পাসকোড। এটি মুছে রিসাইকেল বিনে পাঠান।'
      }
    ],
    junkFolderNamesToDelete: ['unsecured_dump', 'test_keys_leak'],
    expectedTree: [
      {
        name: 'Cloud_Infrastructure',
        path: 'Cloud_Infrastructure',
        infoTitle: 'Cloud Infrastructure Master Container',
        infoEn: 'Datacenter server orchestration and microservices repository.',
        infoBn: 'ক্লাউড সার্ভার ও ডাটা সেন্টারের মূল পরিকাঠামো ফোল্ডার।',
        children: [
          {
            name: 'Environments',
            path: 'Cloud_Infrastructure/Environments',
            infoTitle: 'Cloud Environments',
            infoEn: 'Deployment rings isolating live users from testing code.',
            infoBn: 'ক্লাউড ডেপ্লয়মেন্ট পর্যায়সমূহ (লাইভ ও টেস্টিং আলাদা রাখার জায়গা)।',
            children: [
              {
                name: 'Production',
                path: 'Cloud_Infrastructure/Environments/Production',
                infoTitle: 'Production Ring (Live)',
                infoEn: 'Mission-critical 99.999% uptime cluster serving real end users.',
                infoBn: 'লাইভ প্রোডাকশন সার্ভার যা সাধারণ মানুষ ২৪/৭ ব্যবহার করে।',
                children: [
                  { name: 'App_Cluster', path: 'Cloud_Infrastructure/Environments/Production/App_Cluster', infoTitle: 'Application Cluster', infoEn: 'Auto-scaled Kubernetes pods and load balancers.', infoBn: 'লোড ব্যালান্সার ও অ্যাপ্লিকেশনের সার্ভার ক্লাস্টার।' },
                  { name: 'Database_Replica', path: 'Cloud_Infrastructure/Environments/Production/Database_Replica', infoTitle: 'Database Replicas', infoEn: 'Encrypted PostgreSQL high-availability database cluster.', infoBn: 'উচ্চ ক্ষমতাসম্পন্ন এনক্রিপ্টেড ডাটাবেজ রেপ্লিকা।' },
                  { name: 'SSL_Certs', path: 'Cloud_Infrastructure/Environments/Production/SSL_Certs', infoTitle: 'SSL/TLS Cryptographic Certs', infoEn: '2048-bit RSA encryption certificates and HTTPS keys.', infoBn: 'এইচটিটিপিএস নিরাপত্তা ও ক্রিপ্টোগ্রাফিক সার্টিফিকেট।' }
                ]
              },
              {
                name: 'Staging',
                path: 'Cloud_Infrastructure/Environments/Staging',
                infoTitle: 'Staging Ring (Pre-Release)',
                infoEn: 'Identical mirror of production for pre-flight stress tests.',
                infoBn: 'প্রোডাকশনের হুবহু প্রতিচ্ছবি যাতে রিলিজের আগের টেস্ট চলে।',
                children: [
                  { name: 'QA_Tests', path: 'Cloud_Infrastructure/Environments/Staging/QA_Tests', infoTitle: 'Automated QA Tests', infoEn: 'Cypress and Playwright integration suites.', infoBn: 'স্বয়ংক্রিয় সফটওয়্যার টেস্টিং স্ক্রিপ্ট।' },
                  { name: 'Pre_Release', path: 'Cloud_Infrastructure/Environments/Staging/Pre_Release', infoTitle: 'Pre-Release Release Candidates', infoEn: 'Canary build binaries awaiting stakeholder signoff.', infoBn: 'চূড়ান্ত রিলিজের জন্য অপেক্ষমাণ পরীক্ষামূলক সফটওয়্যার।' }
                ]
              },
              {
                name: 'Development',
                path: 'Cloud_Infrastructure/Environments/Development',
                infoTitle: 'Development Ring',
                infoEn: 'Local developer sandbox and experimental features.',
                infoBn: 'প্রোগ্রামারদের নতুন ফিচার বানানোর পরীক্ষা-নিরীক্ষার জায়গা।',
                children: [
                  { name: 'Local_Containers', path: 'Cloud_Infrastructure/Environments/Development/Local_Containers', infoTitle: 'Docker Local Containers', infoEn: 'Local container compose recipes.', infoBn: 'লোকাল ডকার কন্টেইনার ফোল্ডার।' },
                  { name: 'Sandbox', path: 'Cloud_Infrastructure/Environments/Development/Sandbox', infoTitle: 'Experimental Sandbox', infoEn: 'Isolated exploratory playgrounds.', infoBn: 'স্বাধীন পরীক্ষামূলক কাজের স্যান্ডবক্স।' }
                ]
              }
            ]
          },
          {
            name: 'Backups',
            path: 'Cloud_Infrastructure/Backups',
            infoTitle: 'Backups & Redundancy',
            infoEn: 'Automated off-site disaster recovery and point-in-time snapshots.',
            infoBn: 'সার্ভারের স্বয়ংক্রিয় ব্যাকআপ ও দুর্যোগকালীন রিকভারি ডেটা।',
            children: [
              { name: 'Daily_Snapshots', path: 'Cloud_Infrastructure/Backups/Daily_Snapshots', infoTitle: 'Daily Snapshots', infoEn: 'Daily encrypted incremental disk image backups.', infoBn: 'প্রতিদিনের এনক্রিপ্টেড স্বয়ংক্রিয় ডিস্ক ব্যাকআপ।' },
              { name: 'Disaster_Recovery', path: 'Cloud_Infrastructure/Backups/Disaster_Recovery', infoTitle: 'Disaster Recovery Vault', infoEn: 'Cross-region emergency restore scripts and runbooks.', infoBn: 'সার্ভার ক্র্যাশ করলে দ্রুত চালুর জন্য ইমার্জেন্সি রানবুক।' }
            ]
          },
          {
            name: 'Security_Audits',
            path: 'Cloud_Infrastructure/Security_Audits',
            infoTitle: 'Security & Compliance Audits',
            infoEn: 'Statutory ISO 27001 logs, access tracking, and penetration tests.',
            infoBn: 'নিরাপত্তা নিরীক্ষা, সাইবার আক্রমণ প্রতিরোধ ও এক্সেস লগ।',
            children: [
              { name: 'Access_Logs_2026', path: 'Cloud_Infrastructure/Security_Audits/Access_Logs_2026', infoTitle: 'Audit Access Logs', infoEn: 'Immutable audit trails recording all admin logins.', infoBn: 'সকল অ্যাডমিনের লগইন ও অ্যাকশন হিস্ট্রি লগ।' },
              { name: 'Penetration_Reports', path: 'Cloud_Infrastructure/Security_Audits/Penetration_Reports', infoTitle: 'Penetration Test Reports', infoEn: 'Ethical hacker vulnerability reports and zero-day patches.', infoBn: 'সাইবার সিকিউরিটি ও হ্যাকিং প্রতিরোধ টেস্টের রিপোর্ট।' }
            ]
          }
        ]
      }
    ],
    bilingualGuide: {
      en: "Mission-critical Cloud and Datacenter Architecture. Strict directory compartmentalization protects live user data, secures encryption keys, and enforces regulatory ISO 27001 audit compliance.",
      bn: "পেশাদার ক্লাউড ও ডাটা সেন্টার আর্কিটেকচার। সঠিক ফোল্ডার বিন্যাস সরাসরি ইউজার ডেটা রক্ষা করে এবং আন্তর্জাতিক সাইবার নিরাপত্তা নিয়ম মেনে চলে।"
    }
  }
};

// ==========================================
// 10 DEDICATED ACHIEVEMENTS FOR WINDOWS LAB
// (5 for File Management, 5 for Folder Management)
// ==========================================
export const WINDOWS_ACHIEVEMENTS: Achievement[] = [
  // --- Track 1: File Management (5 Achievements) ---
  {
    id: 'win_file_ext_master',
    title: 'Extension Specialist',
    description: 'Mastered file extensions (.docx, .xlsx, .pptx, .mp4, .jpeg, .pdf) in Windows File Management Level 1 with 100% accuracy.',
    iconName: 'FileType',
    badgeLevel: 1
  },
  {
    id: 'win_academic_organizer',
    title: 'Academic Curator',
    description: 'Perfectly organized school academic subjects and multi-disciplinary homework files in Windows File Management Level 2.',
    iconName: 'GraduationCap',
    badgeLevel: 2
  },
  {
    id: 'win_iso_archivist',
    title: 'ISO 8601 Standardizer',
    description: 'Enforced strict ISO date timestamp naming conventions and archived legacy obsolete files in File Management Level 3.',
    iconName: 'Archive',
    badgeLevel: 3
  },
  {
    id: 'win_studio_producer',
    title: 'Studio Workflow Director',
    description: 'Categorized studio media pipelines cleanly into raw assets, work-in-progress scripts, and final broadcast deliverables in Level 4.',
    iconName: 'Film',
    badgeLevel: 4
  },
  {
    id: 'win_ai_data_architect',
    title: 'AI Pipeline Architect',
    description: 'Architected enterprise machine learning datasets, model checkpoints, prompts, and ethical audit benchmarks with 100% precision in Level 5.',
    iconName: 'BrainCircuit',
    badgeLevel: 5
  },

  // --- Track 2: Folder Management (5 Achievements) ---
  {
    id: 'win_folder_builder',
    title: 'Directory Architect',
    description: 'Mastered fundamental folder creation, subfolder nesting, F2 renaming, and junk pruning across Folder Management Levels 1-2.',
    iconName: 'FolderPlus',
    badgeLevel: 1
  },
  {
    id: 'win_tree_navigator',
    title: 'Hierarchy Specialist',
    description: 'Constructed an intricate 3-tier deep academic stream hierarchy with zero misplaced branches in Folder Management Level 3.',
    iconName: 'FolderTree',
    badgeLevel: 2
  },
  {
    id: 'win_enterprise_curator',
    title: 'Enterprise Administrator',
    description: 'Established complete corporate department governance across Human Resources, Finance, and Operations in Folder Management Level 4.',
    iconName: 'Briefcase',
    badgeLevel: 3
  },
  {
    id: 'win_devops_structure',
    title: 'DevOps Pipeline Organizer',
    description: 'Engineered a modern web application repository structure (src, public, docs) and pruned build caches in Folder Management Level 5.',
  