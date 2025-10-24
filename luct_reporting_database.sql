-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2025 at 04:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `luct_reporting_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `class_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `class_name` varchar(100) NOT NULL,
  `venue` varchar(50) NOT NULL,
  `class_time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`class_id`, `course_id`, `lecturer_id`, `class_name`, `venue`, `class_time`) VALUES
(1, 101, 7, 'Introduction to Algorithms', 'Room 305', 'Monday,12:30'),
(2, 1, 9, 'Calculus 1', 'Hall 6', 'Friday,14:30');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `complaint_text` text NOT NULL,
  `status` enum('pending','reviewed','resolved') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `student_id`, `lecturer_id`, `complaint_text`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 7, 'come to class late', 'pending', '2025-10-19 10:18:43', '2025-10-19 10:18:43'),
(2, 1, 9, 'Did not get feedback', 'pending', '2025-10-19 12:09:13', '2025-10-19 12:09:13');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `credits` int(11) NOT NULL CHECK (`credits` between 1 and 10),
  `semester` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lecturer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `faculty_id`, `course_name`, `course_code`, `credits`, `semester`, `created_at`, `updated_at`, `lecturer_id`) VALUES
(10, 1, 'Introduction to Programming', 'IE1009', 10, 'Fall 2025', '2025-10-19 14:30:22', '2025-10-19 14:30:22', 9),
(11, 1, 'introduction to Webdesign', 'CS305', 10, 'Fall 2025', '2025-10-19 14:30:38', '2025-10-19 14:30:38', 7);

-- --------------------------------------------------------

--
-- Table structure for table `faculties`
--

CREATE TABLE `faculties` (
  `faculty_id` int(6) NOT NULL,
  `faculty_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculties`
--

INSERT INTO `faculties` (`faculty_id`, `faculty_name`) VALUES
(3, 'Engineering');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `faculty_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`faculty_id`, `name`, `email`, `department`, `created_at`) VALUES
(1, 'Dr. Sarah Johnson', 's.johnson@university.edu', 'Computer Science', '2025-10-11 12:19:49'),
(2, 'Prof. Michael Chen', 'm.chen@university.edu', 'Mathematics', '2025-10-11 12:19:49');

-- --------------------------------------------------------

--
-- Table structure for table `lecturer_reports`
--

CREATE TABLE `lecturer_reports` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'References users.user_id (the lecturer who filed this report)',
  `class_id` int(11) NOT NULL COMMENT 'ID of the class being reported on',
  `week_of_reporting` int(11) NOT NULL COMMENT 'Week number of reporting (e.g., 1, 2, 3...)',
  `date_of_lecture` date NOT NULL COMMENT 'Date of the lecture (YYYY-MM-DD)',
  `topic_taught` varchar(255) NOT NULL COMMENT 'Topic covered in the lecture',
  `learning_outcome` text DEFAULT NULL COMMENT 'What students were expected to learn',
  `lecturer_recommendations` text DEFAULT NULL COMMENT 'Suggestions or improvements from the lecturer',
  `number_of_students_present` int(11) NOT NULL COMMENT 'Number of students who attended',
  `total_number_of_students_registered` int(11) NOT NULL COMMENT 'Total enrolled students for the class',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'When the report was created',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last time the report was modified'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lecturer weekly teaching reports';

--
-- Dumping data for table `lecturer_reports`
--

INSERT INTO `lecturer_reports` (`report_id`, `user_id`, `class_id`, `week_of_reporting`, `date_of_lecture`, `topic_taught`, `learning_outcome`, `lecturer_recommendations`, `number_of_students_present`, `total_number_of_students_registered`, `created_at`, `updated_at`) VALUES
(1, 7, 2, 2005, '2025-12-30', 'Algebra', 'functions', 'more practice', 40, 42, '2025-10-19 11:48:48', '2025-10-19 11:48:48');

-- --------------------------------------------------------

--
-- Table structure for table `monitoring`
--

CREATE TABLE `monitoring` (
  `monitoring_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `monitoring`
--

INSERT INTO `monitoring` (`monitoring_id`, `user_id`, `report_id`, `comments`) VALUES
(1, 12, 1, 'Good session. Students engaged well. Suggest more practical examples next time.'),
(2, 7, 1, 'Great session!');

-- --------------------------------------------------------

--
-- Table structure for table `principal_feedback`
--

CREATE TABLE `principal_feedback` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL COMMENT 'References lecturer_reports.report_id',
  `principal_id` int(11) NOT NULL COMMENT 'References users.user_id (must be principal_lecturer or program_leader)',
  `comments` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Principal feedback on lecturer reports';

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `rating_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `rating_value` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`rating_id`, `student_id`, `lecturer_id`, `rating_value`) VALUES
(9, 1, 7, 3),
(10, 1, 9, 4),
(11, 1, 7, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_names` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(150) NOT NULL,
  `user_role` enum('student','lecturer','principal_lecturer','program_leader') NOT NULL,
  `faculty_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_names`, `user_email`, `user_password`, `user_role`, `faculty_id`) VALUES
(1, 'kabelo motseki', 'kabelo@gmail.com', 'userpass', 'student', 1),
(3, 'Toloane Sheila', 'toloane@gmail.com', 'userpass', 'student', 1),
(7, 'Lisene Moshesha', 'Lisene@gmail.com', 'userpass', 'lecturer', 4),
(8, 'John mpelane', 'john@gmail.com', 'user123', 'student', 12),
(9, 'Mustasa Revs', 'mustasa@gmail.com', 'musta123', 'lecturer', 12),
(10, 'Moses Motho', 'motho@gmail.com', 'motho123', 'principal_lecturer', 12),
(11, 'Emtee Hustle', 'emtee@gmail.com', 'emtee123', 'program_leader', 12),
(12, 'Kelly Min', 'kelly@gmail.com', 'userpass', 'student', 12),
(13, 'Eliza Mandown', 'eliza@gmail.com', 'userpass', 'program_leader', 12);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`class_id`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_complaints_student` (`student_id`),
  ADD KEY `fk_complaints_lecturer` (`lecturer_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `course_code` (`course_code`),
  ADD KEY `faculty_id` (`faculty_id`),
  ADD KEY `fk_courses_lecturer` (`lecturer_id`);

--
-- Indexes for table `faculties`
--
ALTER TABLE `faculties`
  ADD PRIMARY KEY (`faculty_id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`faculty_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `lecturer_reports`
--
ALTER TABLE `lecturer_reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `idx_lecturer_reports_date` (`date_of_lecture`),
  ADD KEY `idx_lecturer_reports_user` (`user_id`),
  ADD KEY `idx_lecturer_reports_id` (`report_id`);

--
-- Indexes for table `monitoring`
--
ALTER TABLE `monitoring`
  ADD PRIMARY KEY (`monitoring_id`);

--
-- Indexes for table `principal_feedback`
--
ALTER TABLE `principal_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_principal_feedback_report` (`report_id`),
  ADD KEY `idx_principal_feedback_principal` (`principal_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`rating_id`),
  ADD KEY `fk_ratings_student` (`student_id`),
  ADD KEY `fk_ratings_lecturer` (`lecturer_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `faculties`
--
ALTER TABLE `faculties`
  MODIFY `faculty_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `faculty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lecturer_reports`
--
ALTER TABLE `lecturer_reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `monitoring`
--
ALTER TABLE `monitoring`
  MODIFY `monitoring_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `principal_feedback`
--
ALTER TABLE `principal_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `rating_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `complaints`
--
ALTER TABLE `complaints`
  ADD CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `complaints_ibfk_2` FOREIGN KEY (`lecturer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_complaints_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_complaints_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_courses_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `lecturer_reports`
--
ALTER TABLE `lecturer_reports`
  ADD CONSTRAINT `lecturer_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `principal_feedback`
--
ALTER TABLE `principal_feedback`
  ADD CONSTRAINT `fk_principal_feedback_principal` FOREIGN KEY (`principal_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_principal_feedback_report` FOREIGN KEY (`report_id`) REFERENCES `lecturer_reports` (`report_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `principal_feedback_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `lecturer_reports` (`report_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `principal_feedback_ibfk_2` FOREIGN KEY (`principal_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `fk_ratings_lecturer` FOREIGN KEY (`lecturer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_ratings_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
