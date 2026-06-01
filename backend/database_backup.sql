-- College Management System Database Dump
-- Generated on 2026-05-31 06:48:24

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `admissions`;
CREATE TABLE `admissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `father_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mother_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_selection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aadhaar_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `admissions` WRITE;
INSERT INTO `admissions` (`id`, `student_name`, `father_name`, `mother_name`, `email`, `mobile_number`, `gender`, `dob`, `address`, `course_selection`, `category`, `aadhaar_number`, `document_path`, `status`, `created_at`, `updated_at`) VALUES ('3', 'golu kumar', 'mk rawat', 'kumkum devi', 'golu123@gmail.com', '9608009595', 'Male', '2004-02-05', 'sheotar gaya bihar mohra', 'BA BEd Integrated', 'OBC', '731097963295', '/uploads/admissions/1780005266_logo.png', 'approved', '2026-05-28 21:54:26', '2026-05-28 22:16:34');
INSERT INTO `admissions` (`id`, `student_name`, `father_name`, `mother_name`, `email`, `mobile_number`, `gender`, `dob`, `address`, `course_selection`, `category`, `aadhaar_number`, `document_path`, `status`, `created_at`, `updated_at`) VALUES ('5', 'KAUSHAL KUMAR', 'RASMUNI YADAV', 'REENA DEVI', 'kaushak123@gmail.com', '6547893214', 'Male', '2004-03-23', 'SHEOTAR GAYA BIHAR ,805109', 'BCA', 'General', '123456789123', '/uploads/admissions/1780024263_logo.png', 'approved', '2026-05-29 03:11:03', '2026-05-29 03:37:38');
INSERT INTO `admissions` (`id`, `student_name`, `father_name`, `mother_name`, `email`, `mobile_number`, `gender`, `dob`, `address`, `course_selection`, `category`, `aadhaar_number`, `document_path`, `status`, `created_at`, `updated_at`) VALUES ('6', 'aneesh kumar', 'ram kumar', 'sita devi', 'aneesh123@gmail.com', '7894561230', 'Male', '2004-05-21', 'ghdfresfggsy', 'PhD Botany', 'OBC', '147852369147', '/uploads/admissions/1780025206_logo.png', 'approved', '2026-05-29 03:26:46', '2026-05-29 03:37:35');
UNLOCK TABLES;

DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `announcements` WRITE;
INSERT INTO `announcements` (`id`, `text`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES ('1', '✨ Welcome to Gautam Budha Mahila College, Gaya - Admissions Open for Session 2026-27!', '1', '0', '2026-05-28 21:03:01', '2026-05-29 04:04:31');
INSERT INTO `announcements` (`id`, `text`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES ('2', '📅 Digital Detox - Women\'s Day Notice: Seminar scheduled for next Monday.', '2', '0', '2026-05-28 21:03:01', '2026-05-29 04:04:27');
INSERT INTO `announcements` (`id`, `text`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES ('3', '🏆 Congratulations to our Gold Medalist students in Magadh University exams!', '3', '0', '2026-05-28 21:03:01', '2026-05-29 04:04:26');
INSERT INTO `announcements` (`id`, `text`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES ('4', '📚 CIA Examination Results and Academic Calendar 2026 are now available for download.', '4', '0', '2026-05-28 21:03:01', '2026-05-29 04:04:25');
INSERT INTO `announcements` (`id`, `text`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES ('5', 'hi tomuro will we close collage.', '5', '1', '2026-05-29 04:07:04', '2026-05-29 04:07:04');
UNLOCK TABLES;

DROP TABLE IF EXISTS `attendances`;
CREATE TABLE `attendances` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendances_student_id_course_id_date_unique` (`student_id`,`course_id`,`date`),
  KEY `attendances_course_id_foreign` (`course_id`),
  CONSTRAINT `attendances_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendances_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `attendances` WRITE;
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('1', '1', '1', '2026-05-25', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('2', '1', '2', '2026-05-25', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('3', '2', '1', '2026-05-25', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('4', '2', '2', '2026-05-25', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('5', '3', '1', '2026-05-25', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('6', '3', '2', '2026-05-25', 'late', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('7', '1', '1', '2026-05-26', 'absent', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('8', '1', '2', '2026-05-26', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('9', '2', '1', '2026-05-26', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('10', '2', '2', '2026-05-26', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('11', '3', '1', '2026-05-26', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('12', '3', '2', '2026-05-26', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('13', '1', '1', '2026-05-27', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('14', '1', '2', '2026-05-27', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('15', '2', '1', '2026-05-27', 'absent', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('16', '2', '2', '2026-05-27', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('17', '3', '1', '2026-05-27', 'present', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('18', '3', '2', '2026-05-27', 'late', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('19', '1', '1', '2026-05-28', 'present', '2026-05-28 20:32:34', '2026-05-28 20:32:34');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('20', '2', '1', '2026-05-28', 'present', '2026-05-28 20:32:34', '2026-05-28 20:32:34');
INSERT INTO `attendances` (`id`, `student_id`, `course_id`, `date`, `status`, `created_at`, `updated_at`) VALUES ('21', '3', '1', '2026-05-28', 'present', '2026-05-28 20:32:34', '2026-05-28 20:32:34');
UNLOCK TABLES;

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `cache` WRITE;
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('college-management-system-cache-otp_16', 's:6:\"584316\";', '1780145904');
UNLOCK TABLES;

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','read') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `faculty_id` bigint unsigned DEFAULT NULL,
  `semester` int NOT NULL,
  `credits` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `courses_code_unique` (`code`),
  KEY `courses_department_id_foreign` (`department_id`),
  KEY `courses_faculty_id_foreign` (`faculty_id`),
  CONSTRAINT `courses_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `courses_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `courses` WRITE;
INSERT INTO `courses` (`id`, `name`, `code`, `department_id`, `faculty_id`, `semester`, `credits`, `description`, `created_at`, `updated_at`) VALUES ('1', 'Data Structures and Algorithms', 'CS201', '1', '1', '4', '4', 'Standard college course on Data Structures and Algorithms', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `courses` (`id`, `name`, `code`, `department_id`, `faculty_id`, `semester`, `credits`, `description`, `created_at`, `updated_at`) VALUES ('2', 'Database Management Systems', 'CS202', '1', '2', '4', '4', 'Standard college course on Database Management Systems', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `courses` (`id`, `name`, `code`, `department_id`, `faculty_id`, `semester`, `credits`, `description`, `created_at`, `updated_at`) VALUES ('3', 'Object Oriented Programming', 'CS101', '1', '1', '2', '3', 'Standard college course on Object Oriented Programming', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `courses` (`id`, `name`, `code`, `department_id`, `faculty_id`, `semester`, `credits`, `description`, `created_at`, `updated_at`) VALUES ('4', 'Digital Signal Processing', 'EC201', '2', '3', '4', '4', 'Standard college course on Digital Signal Processing', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `courses` (`id`, `name`, `code`, `department_id`, `faculty_id`, `semester`, `credits`, `description`, `created_at`, `updated_at`) VALUES ('5', 'Microprocessors and Interfacing', 'EC202', '2', '4', '4', '4', 'Standard college course on Microprocessors and Interfacing', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `courses` (`id`, `name`, `code`, `department_id`, `faculty_id`, `semester`, `credits`, `description`, `created_at`, `updated_at`) VALUES ('6', 'Fluid Mechanics', 'ME301', '3', '5', '6', '3', 'Standard college course on Fluid Mechanics', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `courses` (`id`, `name`, `code`, `department_id`, `faculty_id`, `semester`, `credits`, `description`, `created_at`, `updated_at`) VALUES ('7', 'Structural Analysis', 'CE401', '4', '6', '8', '4', 'Standard college course on Structural Analysis', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
UNLOCK TABLES;

DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `head_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_code_unique` (`code`),
  KEY `departments_head_id_foreign` (`head_id`),
  CONSTRAINT `departments_head_id_foreign` FOREIGN KEY (`head_id`) REFERENCES `faculty` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `departments` WRITE;
INSERT INTO `departments` (`id`, `name`, `code`, `description`, `head_id`, `created_at`, `updated_at`) VALUES ('1', 'Computer Science & Engineering', 'CSE', 'Department of Computer Science & Engineering focusing on software, algorithms, and systems.', '1', '2026-05-28 15:00:33', '2026-05-28 15:00:35');
INSERT INTO `departments` (`id`, `name`, `code`, `description`, `head_id`, `created_at`, `updated_at`) VALUES ('2', 'Electronics & Communication', 'ECE', 'Department of Electronics & Communication Engineering covering signals, circuits, and networking.', '3', '2026-05-28 15:00:33', '2026-05-28 15:00:35');
INSERT INTO `departments` (`id`, `name`, `code`, `description`, `head_id`, `created_at`, `updated_at`) VALUES ('3', 'Mechanical Engineering', 'ME', 'Department of Mechanical Engineering focusing on thermal, manufacturing, and machine design.', '5', '2026-05-28 15:00:33', '2026-05-28 15:00:35');
INSERT INTO `departments` (`id`, `name`, `code`, `description`, `head_id`, `created_at`, `updated_at`) VALUES ('4', 'Civil Engineering', 'CE', 'Department of Civil Engineering covering infrastructure, structural design, and environments.', '6', '2026-05-28 15:00:33', '2026-05-28 15:00:35');
UNLOCK TABLES;

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date` date NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `events` WRITE;
INSERT INTO `events` (`id`, `title`, `description`, `date`, `location`, `image_path`, `created_at`, `updated_at`) VALUES ('2', 'Inter-College Sports Tournament', 'Annual sports meet including track and field events, basketball, badminton, and table tennis.', '2026-06-22', 'Sports Ground Gaya', NULL, '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `events` (`id`, `title`, `description`, `date`, `location`, `image_path`, `created_at`, `updated_at`) VALUES ('3', 'National Level Chemistry Symposium', 'Keynote speeches and student paper presentations on sustainable and green chemistry practices.', '2026-07-05', 'Seminar Hall A', NULL, '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `events` (`id`, `title`, `description`, `date`, `location`, `image_path`, `created_at`, `updated_at`) VALUES ('4', 'sports', 'all students come to collage campos. 9:00 AM', '2026-05-31', 'kota', '/uploads/events/1779994683_mm.png', '2026-05-28 18:52:49', '2026-05-28 18:58:03');
INSERT INTO `events` (`id`, `title`, `description`, `date`, `location`, `image_path`, `created_at`, `updated_at`) VALUES ('5', 'fun', 'write to ready', '2026-06-12', 'gaya/ fun', NULL, '2026-05-28 19:02:07', '2026-05-28 19:02:07');
INSERT INTO `events` (`id`, `title`, `description`, `date`, `location`, `image_path`, `created_at`, `updated_at`) VALUES ('6', 'hfgff', 'dvykutefg', '0226-02-05', 'ladak', NULL, '2026-05-28 19:02:34', '2026-05-28 19:02:34');
UNLOCK TABLES;

DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `total_marks` int NOT NULL,
  `exam_type` enum('midterm','final','quiz','assignment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exams_course_id_foreign` (`course_id`),
  CONSTRAINT `exams_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `exams` WRITE;
INSERT INTO `exams` (`id`, `name`, `course_id`, `date`, `total_marks`, `exam_type`, `created_at`, `updated_at`) VALUES ('1', 'DSA Midterm Exam', '1', '2026-05-18', '50', 'midterm', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
UNLOCK TABLES;

DROP TABLE IF EXISTS `faculty`;
CREATE TABLE `faculty` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `employee_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qualification` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joining_date` date NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `faculty_employee_id_unique` (`employee_id`),
  KEY `faculty_user_id_foreign` (`user_id`),
  KEY `faculty_department_id_foreign` (`department_id`),
  CONSTRAINT `faculty_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `faculty_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `faculty` WRITE;
INSERT INTO `faculty` (`id`, `user_id`, `employee_id`, `department_id`, `designation`, `qualification`, `phone`, `joining_date`, `avatar`, `created_at`, `updated_at`) VALUES ('1', '2', 'FAC001', '1', 'Professor', 'Ph.D. in Computer Science', '+12345678901', '2022-05-28', NULL, '2026-05-28 15:00:33', '2026-05-28 15:00:33');
INSERT INTO `faculty` (`id`, `user_id`, `employee_id`, `department_id`, `designation`, `qualification`, `phone`, `joining_date`, `avatar`, `created_at`, `updated_at`) VALUES ('2', '3', 'FAC002', '1', 'Associate Professor', 'Ph.D. in Mathematics', '+12345678902', '2022-05-28', NULL, '2026-05-28 15:00:33', '2026-05-28 15:00:33');
INSERT INTO `faculty` (`id`, `user_id`, `employee_id`, `department_id`, `designation`, `qualification`, `phone`, `joining_date`, `avatar`, `created_at`, `updated_at`) VALUES ('3', '4', 'FAC003', '2', 'Professor', 'Ph.D. in Physics', '+12345678903', '2022-05-28', NULL, '2026-05-28 15:00:34', '2026-05-28 15:00:34');
INSERT INTO `faculty` (`id`, `user_id`, `employee_id`, `department_id`, `designation`, `qualification`, `phone`, `joining_date`, `avatar`, `created_at`, `updated_at`) VALUES ('4', '5', 'FAC004', '2', 'Assistant Professor', 'M.Tech in Electrical Engineering', '+12345678904', '2022-05-28', NULL, '2026-05-28 15:00:34', '2026-05-28 15:00:34');
INSERT INTO `faculty` (`id`, `user_id`, `employee_id`, `department_id`, `designation`, `qualification`, `phone`, `joining_date`, `avatar`, `created_at`, `updated_at`) VALUES ('5', '6', 'FAC005', '3', 'Professor', 'Ph.D. in Thermodynamics', '+12345678905', '2022-05-28', NULL, '2026-05-28 15:00:35', '2026-05-28 15:00:35');
INSERT INTO `faculty` (`id`, `user_id`, `employee_id`, `department_id`, `designation`, `qualification`, `phone`, `joining_date`, `avatar`, `created_at`, `updated_at`) VALUES ('6', '7', 'FAC006', '4', 'Associate Professor', 'Ph.D. in Structural Engineering', '+12345678906', '2022-05-28', NULL, '2026-05-28 15:00:35', '2026-05-28 15:00:35');
INSERT INTO `faculty` (`id`, `user_id`, `employee_id`, `department_id`, `designation`, `qualification`, `phone`, `joining_date`, `avatar`, `created_at`, `updated_at`) VALUES ('7', '20', 'kaushal0123', '1', 'mba', 'phd', '9874563214', '2004-02-12', NULL, '2026-05-30 15:18:56', '2026-05-30 15:18:56');
INSERT INTO `faculty` (`id`, `user_id`, `employee_id`, `department_id`, `designation`, `qualification`, `phone`, `joining_date`, `avatar`, `created_at`, `updated_at`) VALUES ('8', '21', 'RENU@21', '4', 'BCA', 'PHD', '1234567891', '2026-02-05', NULL, '2026-05-30 15:47:36', '2026-05-30 15:47:36');
UNLOCK TABLES;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `fee_structures`;
CREATE TABLE `fee_structures` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tuition_fee` int NOT NULL,
  `lab_charges` int NOT NULL DEFAULT '0',
  `total_fee` int NOT NULL,
  `year` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '2026-27',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `fee_structures` WRITE;
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('1', 'BA', '120000', '0', '120000', '2026-27', '2026-05-29 02:37:56', '2026-05-30 16:04:02');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('2', 'BSc Mathematics', '16500', '2000', '18500', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('3', 'BSc Biology', '16500', '3500', '20000', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('4', 'BCA', '22000', '4000', '26000', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('5', 'BA BEd Integrated', '25000', '2000', '27000', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('6', 'BSc BEd Integrated', '28000', '4000', '32000', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('7', 'MSc Botany', '28000', '6000', '34000', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('8', 'MSc Chemistry', '28000', '6000', '34000', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('9', 'MSc Mathematics', '28000', '0', '28000', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('10', 'MSc Zoology', '28000', '6000', '34000', '2026-27', '2026-05-29 02:37:56', '2026-05-29 02:37:56');
INSERT INTO `fee_structures` (`id`, `course_name`, `tuition_fee`, `lab_charges`, `total_fee`, `year`, `created_at`, `updated_at`) VALUES ('12', 'collage fee', '1000', '0', '1000', '2026-27', '2026-05-29 03:38:10', '2026-05-29 03:38:10');
UNLOCK TABLES;

DROP TABLE IF EXISTS `gallery`;
CREATE TABLE `gallery` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'campus',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `gallery` WRITE;
INSERT INTO `gallery` (`id`, `title`, `image_path`, `category`, `created_at`, `updated_at`) VALUES ('1', NULL, '/uploads/gallery/1779995995_WhatsApp_Image_2026-04-18_at_1.26.55_AM.jpeg', 'campus', '2026-05-28 19:19:55', '2026-05-28 19:19:55');
INSERT INTO `gallery` (`id`, `title`, `image_path`, `category`, `created_at`, `updated_at`) VALUES ('2', 'hhhh', '/uploads/gallery/1779996140_logo.png', 'sports', '2026-05-28 19:22:20', '2026-05-28 19:22:20');
INSERT INTO `gallery` (`id`, `title`, `image_path`, `category`, `created_at`, `updated_at`) VALUES ('3', 'harshit', '/uploads/gallery/1779998603_WhatsApp_Image_2026-04-18_at_1.26.55_AM_(2).jpeg', 'cultural', '2026-05-28 20:03:23', '2026-05-28 20:03:23');
UNLOCK TABLES;

DROP TABLE IF EXISTS `homepage_sliders`;
CREATE TABLE `homepage_sliders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `button_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `button_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `homepage_sliders` WRITE;
INSERT INTO `homepage_sliders` (`id`, `title`, `subtitle`, `caption`, `description`, `image_path`, `button_text`, `button_link`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES ('1', 'TENTH CONVOCATION', 'Magadh University, Bodh Gaya', 'GOLD MEDALIST', 'Empowering students through knowledge, academic excellence, and state-of-the-art practical research labs.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop', 'Apply Online 2026', '/admission?tab=apply', '1', '1', '2026-05-28 21:03:01', '2026-05-28 21:03:01');
INSERT INTO `homepage_sliders` (`id`, `title`, `subtitle`, `caption`, `description`, `image_path`, `button_text`, `button_link`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES ('2', 'ACADEMIC EXCELLENCE', 'Gautam Budha Mahila College', 'TOPPERS CONGRATULATIONS', 'Our students continue to secure gold medals in Magadh University boards.', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop', 'Apply Online 2026', '/admission?tab=apply', '2', '1', '2026-05-28 21:03:01', '2026-05-28 21:03:01');
INSERT INTO `homepage_sliders` (`id`, `title`, `subtitle`, `caption`, `description`, `image_path`, `button_text`, `button_link`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES ('3', 'INFRASTRUCTURE & LABS', 'Modern Zoology & Physics Labs', 'STATE-OF-THE-ART FACILITIES', 'State-of-the-art practical research labs with modern equipments.', 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1200&auto=format&fit=crop', 'Apply Online 2026', '/admission?tab=apply', '3', '1', '2026-05-28 21:03:01', '2026-05-28 21:03:01');
UNLOCK TABLES;

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `migrations` WRITE;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('1', '0001_01_01_000000_create_users_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('2', '0001_01_01_000001_create_cache_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('3', '0001_01_01_000002_create_jobs_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('4', '2024_01_01_000001_create_departments_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('5', '2024_01_01_000002_create_faculty_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('6', '2024_01_01_000003_create_students_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('7', '2024_01_01_000004_create_courses_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('8', '2024_01_01_000005_create_attendances_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('9', '2024_01_01_000006_create_exams_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('10', '2024_01_01_000007_create_results_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('11', '2024_01_01_000008_create_personal_access_tokens_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('12', '2024_01_01_000009_create_admissions_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('13', '2024_01_01_000010_create_notices_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('14', '2024_01_01_000011_create_gallery_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('15', '2024_01_01_000012_create_events_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('16', '2024_01_01_000013_create_syllabus_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('17', '2024_01_01_000014_create_contact_messages_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('18', '2026_05_28_000001_create_website_settings_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('19', '2026_05_28_000002_create_homepage_sliders_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('20', '2026_05_28_000003_create_announcements_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('21', '2026_05_29_023710_create_fee_structures_table', '2');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('22', '2026_05_29_104357_create_page_contents_table', '3');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('23', '2026_05_30_115501_add_mobile_number_to_users_table', '4');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('24', '2026_05_30_121136_add_otp_settings_to_website_settings_table', '5');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('25', '2026_05_30_140924_add_razorpay_settings_to_website_settings_table', '6');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('26', '2026_05_30_150808_add_plain_password_to_users_table', '7');
UNLOCK TABLES;

DROP TABLE IF EXISTS `notices`;
CREATE TABLE `notices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `is_important` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `notices` WRITE;
INSERT INTO `notices` (`id`, `title`, `content`, `pdf_path`, `category`, `is_important`, `created_at`, `updated_at`) VALUES ('1', 'Admissions Open for BA, BSc, BCA, BEd, MSc 2026-27', 'Online application portal is now active for all undergraduate and postgraduate courses. Please read instructions carefully before applying.', NULL, 'admission', '1', '2026-05-25 15:00:38', '2026-05-25 15:00:38');
INSERT INTO `notices` (`id`, `title`, `content`, `pdf_path`, `category`, `is_important`, `created_at`, `updated_at`) VALUES ('2', 'Syllabus and Exam Schedule for MU Sem-II/IV Exams', 'Exam dates and syllabus details have been announced by the university. Detailed timetable is available on the portal.', NULL, 'exam', '1', '2026-05-24 15:00:38', '2026-05-24 15:00:38');
INSERT INTO `notices` (`id`, `title`, `content`, `pdf_path`, `category`, `is_important`, `created_at`, `updated_at`) VALUES ('3', 'National Seminar on \"Emerging Trends in Zoology\" on June 10', 'The Department of Zoology is organizing a national seminar. Registrations are open until June 5.', NULL, 'academic', '0', '2026-05-22 15:00:38', '2026-05-22 15:00:38');
INSERT INTO `notices` (`id`, `title`, `content`, `pdf_path`, `category`, `is_important`, `created_at`, `updated_at`) VALUES ('4', 'Extension of Online Fee Payment Date to June 5', 'The deadline for online payment of semester fees has been extended to June 5, 2026, without any late fee.', NULL, 'admission', '0', '2026-05-20 15:00:38', '2026-05-20 15:00:38');
INSERT INTO `notices` (`id`, `title`, `content`, `pdf_path`, `category`, `is_important`, `created_at`, `updated_at`) VALUES ('5', 'NSS Enrollment Guidelines and Activity Schedule', 'New student enrollment for NSS activities has started. Register at the college office or with the NSS coordinator.', NULL, 'general', '0', '2026-05-18 15:00:38', '2026-05-18 15:00:38');
INSERT INTO `notices` (`id`, `title`, `content`, `pdf_path`, `category`, `is_important`, `created_at`, `updated_at`) VALUES ('6', 'bca sem 2 exam', 'bca sem 2 exam 12/10/2006', '/uploads/notices/1780027859_logo.png', 'general', '1', '2026-05-29 04:10:59', '2026-05-29 04:10:59');
UNLOCK TABLES;

DROP TABLE IF EXISTS `page_contents`;
CREATE TABLE `page_contents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `page` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_contents_page_section_unique` (`page`,`section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `personal_access_tokens` WRITE;
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('16', 'App\\Models\\User', '18', 'auth-token', '388e58609e3bb568b0e39399586a05b2ad5218d367328062245c8a4bd587142b', '[\"*\"]', NULL, NULL, '2026-05-30 11:57:36', '2026-05-30 11:57:36');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('24', 'App\\Models\\User', '20', 'auth-token', '32d591607b377f37d338b50bf01c3e802297b490c62e32751a5ade0d71c40d93', '[\"*\"]', '2026-05-30 15:30:49', NULL, '2026-05-30 15:20:27', '2026-05-30 15:30:49');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('28', 'App\\Models\\User', '1', 'auth-token', 'd16e25361f4d64e2561644583fc1ddb20a73cc746380124d317ce25adaffe9c8', '[\"*\"]', '2026-05-31 06:42:33', NULL, '2026-05-30 17:18:16', '2026-05-31 06:42:33');
UNLOCK TABLES;

DROP TABLE IF EXISTS `results`;
CREATE TABLE `results` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `exam_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `marks_obtained` decimal(5,2) NOT NULL,
  `grade` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `results_exam_id_student_id_unique` (`exam_id`,`student_id`),
  KEY `results_student_id_foreign` (`student_id`),
  CONSTRAINT `results_exam_id_foreign` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `results_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `results` WRITE;
INSERT INTO `results` (`id`, `exam_id`, `student_id`, `marks_obtained`, `grade`, `remarks`, `created_at`, `updated_at`) VALUES ('1', '1', '1', '45.00', 'A+', 'Outstanding performance.', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `results` (`id`, `exam_id`, `student_id`, `marks_obtained`, `grade`, `remarks`, `created_at`, `updated_at`) VALUES ('2', '1', '2', '38.00', 'B', 'Good attempt, can improve on Trees.', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `results` (`id`, `exam_id`, `student_id`, `marks_obtained`, `grade`, `remarks`, `created_at`, `updated_at`) VALUES ('3', '1', '3', '22.00', 'F', 'Needs attention.', '2026-05-28 15:00:38', '2026-05-29 04:12:47');
UNLOCK TABLES;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `sessions` WRITE;
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('APd6TtlQb5KruTd03HOTdISbuCtp71hYtkoEtxPO', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMFdBZkNOSDVVd1RocHExVThTYjVqcHIzejlyN0NKbkJWNXpZbmhiSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1780161582');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('ObeDnTdHeyYpC5NAdEvwZai5OZu9CKj1eqHcUISN', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQmlCVGNsblNnNmhhZEdzU0RoSW5yRmJFQ01nZVJicXVrY3lXVmhLUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1780209748');
UNLOCK TABLES;

DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `enrollment_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `semester` int NOT NULL,
  `dob` date DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `admission_date` date NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `students_enrollment_no_unique` (`enrollment_no`),
  KEY `students_user_id_foreign` (`user_id`),
  KEY `students_department_id_foreign` (`department_id`),
  CONSTRAINT `students_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `students_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `students` WRITE;
INSERT INTO `students` (`id`, `user_id`, `enrollment_no`, `department_id`, `semester`, `dob`, `phone`, `address`, `admission_date`, `avatar`, `created_at`, `updated_at`) VALUES ('1', '8', 'STU001', '1', '4', '2006-05-28', '+19876543211', '123 College St, University Campus', '2024-05-28', NULL, '2026-05-28 15:00:35', '2026-05-28 15:00:35');
INSERT INTO `students` (`id`, `user_id`, `enrollment_no`, `department_id`, `semester`, `dob`, `phone`, `address`, `admission_date`, `avatar`, `created_at`, `updated_at`) VALUES ('2', '9', 'STU002', '1', '4', '2006-05-28', '+19876543212', '123 College St, University Campus', '2024-05-28', NULL, '2026-05-28 15:00:36', '2026-05-28 15:00:36');
INSERT INTO `students` (`id`, `user_id`, `enrollment_no`, `department_id`, `semester`, `dob`, `phone`, `address`, `admission_date`, `avatar`, `created_at`, `updated_at`) VALUES ('3', '10', 'STU003', '1', '4', '2006-05-28', '+19876543213', '123 College St, University Campus', '2024-05-28', NULL, '2026-05-28 15:00:36', '2026-05-28 15:00:36');
INSERT INTO `students` (`id`, `user_id`, `enrollment_no`, `department_id`, `semester`, `dob`, `phone`, `address`, `admission_date`, `avatar`, `created_at`, `updated_at`) VALUES ('4', '11', 'STU004', '1', '2', '2006-05-28', '+19876543214', '123 College St, University Campus', '2024-05-28', NULL, '2026-05-28 15:00:36', '2026-05-28 15:00:36');
INSERT INTO `students` (`id`, `user_id`, `enrollment_no`, `department_id`, `semester`, `dob`, `phone`, `address`, `admission_date`, `avatar`, `created_at`, `updated_at`) VALUES ('5', '12', 'STU005', '2', '4', '2006-05-28', '+19876543215', '123 College St, University Campus', '2024-05-28', NULL, '2026-05-28 15:00:37', '2026-05-28 15:00:37');
INSERT INTO `students` (`id`, `user_id`, `enrollment_no`, `department_id`, `semester`, `dob`, `phone`, `address`, `admission_date`, `avatar`, `created_at`, `updated_at`) VALUES ('6', '13', 'STU006', '2', '4', '2006-05-28', '+19876543216', '123 College St, University Campus', '2024-05-28', NULL, '2026-05-28 15:00:37', '2026-05-28 15:00:37');
INSERT INTO `students` (`id`, `user_id`, `enrollment_no`, `department_id`, `semester`, `dob`, `phone`, `address`, `admission_date`, `avatar`, `created_at`, `updated_at`) VALUES ('7', '14', 'STU007', '3', '6', '2006-05-28', '+19876543217', '123 College St, University Campus', '2024-05-28', NULL, '2026-05-28 15:00:37', '2026-05-28 15:00:37');
UNLOCK TABLES;

DROP TABLE IF EXISTS `syllabus`;
CREATE TABLE `syllabus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `semester` int NOT NULL,
  `pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plain_password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','faculty','student') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_mobile_number_unique` (`mobile_number`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `users` WRITE;
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('1', 'System Administrator', 'golupatelbr02@gmail.com', NULL, NULL, '$2y$12$BShgUnWEfELlK/LY9SoZb.5gDCzkCuWRO776Q1hDlLvMJqM7x5ueO', 'password', 'admin', NULL, '2026-05-28 15:00:33', '2026-05-28 15:40:14');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('2', 'Dr. Alan Turing', 'alan@college.com', NULL, NULL, '$2y$12$jpsFOrUwtVVZhsolC7iaee6YDkqCCmTzg9S6BpK0iK0TM7wOLIZHy', 'password', 'faculty', NULL, '2026-05-28 15:00:33', '2026-05-28 15:00:33');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('3', 'Dr. Grace Hopper', 'grace@college.com', NULL, NULL, '$2y$12$L4pIvlpNa3Vp5mL34vk2q.5MOt2NLjU/rlWqaK2t3VaGh7/N16ZwO', 'password', 'faculty', NULL, '2026-05-28 15:00:33', '2026-05-28 15:00:33');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('4', 'Dr. Richard Feynman', 'richard@college.com', NULL, NULL, '$2y$12$bzTJr.dJRuMkFwUo3McZD.QUvdjFkEPnfqBqrGeY7X1V6oI68gJHK', 'password', 'faculty', NULL, '2026-05-28 15:00:34', '2026-05-28 15:00:34');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('5', 'Dr. Nikola Tesla', 'nikola@college.com', NULL, NULL, '$2y$12$f4bxgQFocTT1GgsEzZ2UJOm5Wbuns94s5uWNr4WP.PHuDmUZxuvye', 'password', 'faculty', NULL, '2026-05-28 15:00:34', '2026-05-28 15:00:34');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('6', 'Dr. James Watt', 'james@college.com', NULL, NULL, '$2y$12$.GOcX26MJURw4wVYhJdSPufvBx1arcHqx.L8G5WSMfhwwODJ/6Jka', 'password', 'faculty', NULL, '2026-05-28 15:00:35', '2026-05-28 15:00:35');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('7', 'Dr. Thomas Telford', 'thomas@college.com', NULL, NULL, '$2y$12$joyjtHeT6PKEkR5GiXoXXeRMWBXbYsAcovmU8ef5414FM0Nou/7hy', 'password', 'faculty', NULL, '2026-05-28 15:00:35', '2026-05-28 15:00:35');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('8', 'John Doe', 'john@student.com', NULL, NULL, '$2y$12$D44tfM98VOGpg25V5Yape.TUPBHJ9F7XzgQw6XO8u8Ap0YvC.dBR.', 'password', 'student', NULL, '2026-05-28 15:00:35', '2026-05-28 15:00:35');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('9', 'Jane Smith', 'jane@student.com', NULL, NULL, '$2y$12$ExAuxLQ3uJZ1th4pUjuwBeBX4MG.wGAPqOR28reWXCOOvOSsfSEha', 'password', 'student', NULL, '2026-05-28 15:00:35', '2026-05-28 15:00:35');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('10', 'Bob Johnson', 'bob@student.com', NULL, NULL, '$2y$12$zDixBj8SK6TWuoMef5dgl.rW4AA8EO6m.4HsUmi1jFNopPucMFlWO', 'password', 'student', NULL, '2026-05-28 15:00:36', '2026-05-28 15:00:36');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('11', 'Alice Williams', 'alice@student.com', NULL, NULL, '$2y$12$aZuwleHosaX7P90iI67MsOUMdk9mnxjoqey0mttHcU1jvIc03ItBG', 'password', 'student', NULL, '2026-05-28 15:00:36', '2026-05-28 15:00:36');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('12', 'Charlie Brown', 'charlie@student.com', NULL, NULL, '$2y$12$rw2Vz15rbvBhg38KgNMPjuqz14p3eiPSPxjpBWwP895CYwL3iQX/u', 'password', 'student', NULL, '2026-05-28 15:00:37', '2026-05-28 15:00:37');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('13', 'David Miller', 'david@student.com', NULL, NULL, '$2y$12$qhLviiGUYsKGErRRNMlP4utIQdgebwG/HcBBNCtWSZk64deoICoLa', 'password', 'student', NULL, '2026-05-28 15:00:37', '2026-05-28 15:00:37');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('14', 'Eva Davis', 'eva@student.com', NULL, NULL, '$2y$12$k9FEK8DvHf08DVQT2iVAP.3iBQXRxsOLpGIc/EqTwqLrjzHW6oG1i', 'password', 'student', NULL, '2026-05-28 15:00:37', '2026-05-28 15:00:37');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('16', 'Harshit Meena', 'harshitmeena200505@gmail.com', NULL, NULL, '$2y$12$YOXTNDlRhDg4F9mAsHtwVewIxXgN6QqM4MG4wwCYQmTuUvk5o9eBi', 'password', 'student', NULL, '2026-05-28 15:46:58', '2026-05-28 15:46:58');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('17', 'jonsan sir', 'arvindkumarnk62053@gmail.com', NULL, NULL, '$2y$12$0hXQlXmgeDZCsadojqviWuorQVHlrnkup3fuXzAhpke1nXkrZrOOO', 'password', 'faculty', NULL, '2026-05-28 20:13:38', '2026-05-28 20:13:38');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('20', 'kaushal', 'kaushal@gmail.com', NULL, NULL, '$2y$12$z8uGdCpMmWrK4eNsm9WOPuNxB49PpU66iTHs75Hr4tRP1bUbc14eO', 'kaushal@123', 'faculty', NULL, '2026-05-30 15:18:56', '2026-05-30 15:18:56');
INSERT INTO `users` (`id`, `name`, `email`, `mobile_number`, `email_verified_at`, `password`, `plain_password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES ('21', 'renu devi', 'renu21@gmail.com', NULL, NULL, '$2y$12$w1I1N8ov/YrTeHBOENu.b.1iUySqsmhjBEE2koB3.m3351YtxqXNO', 'reenu@123', 'faculty', NULL, '2026-05-30 15:47:36', '2026-05-30 15:47:36');
UNLOCK TABLES;

DROP TABLE IF EXISTS `website_settings`;
CREATE TABLE `website_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `website_settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `website_settings` WRITE;
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('1', 'college_name', 'Gautam Budha Mahila College, Gaya', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('2', 'college_name_hindi', 'गौतम बुद्ध महिला महाविद्यालय, गयाजी', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('3', 'college_subtitle', 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('4', 'logo_path', '/uploads/logo/logo_1780024354.png', 'image', '2026-05-28 15:00:38', '2026-05-29 03:12:34');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('5', 'primary_color', '#0b1b3d', 'color', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('6', 'secondary_color', '#cc0000', 'color', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('7', 'accent_color', '#eab308', 'color', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('8', 'navbar_bg', '#0b1b3d', 'color', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('9', 'hero_bg', '#990000', 'color', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('10', 'font_family', 'Inter', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('11', 'button_style', 'rounded', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('12', 'address', 'S.K. Road, Behind Civil Line Thana, Gaya, Bihar - 823001', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('13', 'phone', '9608009595', 'text', '2026-05-28 15:00:38', '2026-05-28 21:14:19');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('14', 'email', 'info@gbmcollegegaya.org', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('15', 'vc_name', 'Prof. (Dr.) Dilip Kumar Kesari', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('16', 'vc_designation', 'Vice Chancellor, Magadh University', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('17', 'vc_message', 'Welcome to Gautam Budha Mahila College. Education is not just about loading minds with facts, it is about sparking a flame of scientific inquiry. We strive to provide our students with the resource support they need to become responsible global citizens and leaders in their chosen professions.', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('18', 'vc_image_path', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('19', 'principal_name', 'Prof. (Dr.) Seema Patel', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('20', 'principal_designation', 'Principal, Gautam Budha Mahila College', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('21', 'principal_message', 'At Gautam Budha Mahila College, we have established a culture of academic rigor and student achievements. With a focus on research, modern laboratories, and expert guidance, our campus continues to be the top choice for students looking to excel in science and computer applications.', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('22', 'principal_image_path', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('23', 'patron_name', 'Dr. Sunita Sharma', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('24', 'patron_designation', 'Patron, Gautam Budha Mahila College', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('25', 'patron_message', 'It is an honor to lead this institution. We have structured a syllabus support framework, dynamic co-curricular activities, and sports events to ensure that education is holistic, enjoyable, and creates highly employable graduates.', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('26', 'patron_image_path', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('27', 'stats_years', '20', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('28', 'stats_programs', '18', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('29', 'stats_students', '3500', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('30', 'stats_faculty', '80', 'text', '2026-05-28 15:00:38', '2026-05-28 15:00:38');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('31', 'affiliation_name', 'Magadh University', 'text', '2026-05-28 21:03:01', '2026-05-28 21:03:01');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('32', 'affiliation_logo_path', '/uploads/logo/mu_logo_1780024364.png', 'image', '2026-05-28 21:03:01', '2026-05-29 03:12:44');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('33', 'otp_sms_enabled', '0', 'boolean', '2026-05-30 12:11:56', '2026-05-30 12:11:56');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('34', 'otp_email_enabled', '1', 'boolean', '2026-05-30 12:11:56', '2026-05-30 12:13:42');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('35', 'otp_sms_api_url', 'https://api.smsgateway.com/send?apikey={API_KEY}&mobile={MOBILE}&message={MESSAGE}&sender={SENDER_ID}&template_id={TEMPLATE_ID}', 'text', '2026-05-30 12:11:56', '2026-05-30 12:11:56');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('36', 'otp_sms_api_key', 'MOCK_API_KEY_123', 'text', '2026-05-30 12:11:56', '2026-05-30 12:11:56');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('37', 'otp_sms_sender_id', 'GBMCGY', 'text', '2026-05-30 12:11:56', '2026-05-30 12:11:56');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('38', 'otp_sms_template_id', '1207161829102930192', 'text', '2026-05-30 12:11:56', '2026-05-30 12:11:56');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('39', 'otp_sms_message_template', 'Dear student, your verification OTP is {#otp#}. Gautam Budha Mahila College, Gaya.', 'text', '2026-05-30 12:11:56', '2026-05-30 12:11:56');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('40', 'otp_code_length', '6', 'text', '2026-05-30 12:11:56', '2026-05-30 12:13:43');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('41', 'otp_code_type', 'numeric', 'text', '2026-05-30 12:11:56', '2026-05-30 12:13:43');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('42', 'otp_test_mode', '1', 'boolean', '2026-05-30 12:11:56', '2026-05-30 12:11:56');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('43', 'razorpay_enabled', '0', 'boolean', '2026-05-30 14:09:39', '2026-05-30 14:09:39');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('44', 'razorpay_key_id', 'rzp_test_MOCK_KEY_ID_123', 'text', '2026-05-30 14:09:39', '2026-05-30 14:09:39');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('45', 'razorpay_key_secret', 'MOCK_SECRET_123', 'text', '2026-05-30 14:09:39', '2026-05-30 14:09:39');
INSERT INTO `website_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('46', 'razorpay_test_mode', '1', 'boolean', '2026-05-30 14:09:39', '2026-05-30 14:09:39');
UNLOCK TABLES;

SET FOREIGN_KEY_CHECKS=1;
