-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 23 Jun 2024 pada 07.32
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tbpweb`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `forumposts`
--

CREATE TABLE `forumposts` (
  `post_id` int(11) NOT NULL,
  `thread_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `forumposts`
--

INSERT INTO `forumposts` (`post_id`, `thread_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 1, 4, 'aku sih ndak tau, tapi cuma mau bilang semangat deh klo dapat kerjaan itu:)', '2024-06-20 18:03:45', '2024-06-20 18:03:45'),
(2, 1, 4, 'wkwkwk', '2024-06-20 18:03:51', '2024-06-20 18:03:51'),
(3, 1, 5, 'setau aku ya, itu tu tergantung perusahaannya masing-masing', '2024-06-20 18:04:59', '2024-06-20 18:04:59'),
(4, 1, 5, 'emang kamu KP dapat di perusahaan mana ?', '2024-06-20 18:05:13', '2024-06-20 18:05:13'),
(5, 1, 3, 'di PT Semen Padang', '2024-06-20 18:06:06', '2024-06-20 18:06:06'),
(6, 1, 5, 'coba liat di peraturan perusahaan coba, harusnya ada disitu tu', '2024-06-20 18:07:31', '2024-06-20 18:07:31'),
(7, 1, 5, 'klo ngga ada bisa coba tanya\" ke bendahara atau sekretaris perusahaan', '2024-06-20 18:07:55', '2024-06-20 18:09:09'),
(8, 1, 3, 'oke deh, makasih ya sarannya dicoba dulu', '2024-06-20 18:09:35', '2024-06-20 18:09:35');

-- --------------------------------------------------------

--
-- Struktur dari tabel `forumthreads`
--

CREATE TABLE `forumthreads` (
  `thread_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `forumthreads`
--

INSERT INTO `forumthreads` (`thread_id`, `title`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Gess ada yang tau cara bikin laporan keuangan tahunan perusahaan ngga ?', 3, '2024-06-20 18:01:12', '2024-06-20 18:01:12');

-- --------------------------------------------------------

--
-- Struktur dari tabel `logbookcomments`
--

CREATE TABLE `logbookcomments` (
  `comment_id` int(11) NOT NULL,
  `entry_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `logbookcomments`
--

INSERT INTO `logbookcomments` (`comment_id`, `entry_id`, `user_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 1, 6, 'Tolong kegiatannya lebih dirincikan lagi jangan digambarkan secara general saja', '2024-06-22 17:43:41', '2024-06-22 17:43:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `logbookentries`
--

CREATE TABLE `logbookentries` (
  `entry_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `activity` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `logbookentries`
--

INSERT INTO `logbookentries` (`entry_id`, `project_id`, `date`, `activity`, `description`, `created_at`) VALUES
(1, 1, '2024-05-01', 'Pengenalan lingkungan kerja', 'Diajak berkeliling dari pagi sampai jam istirahat siang kemudian disuruh mengamati sendiri sampai sore', '2024-06-20 18:29:39'),
(2, 1, '2024-05-02', 'Memulai pekerjaan sebagai staff administrasi perusahaan', 'hari ini saya ditempatkan di staff administrasi dan melakukan beberapa pekerjaan adiministrasi seperti \r\n-blablabla\r\n-blabla\r\n-blablabla', '2024-06-21 14:43:01');

-- --------------------------------------------------------

--
-- Struktur dari tabel `projectfiles`
--

CREATE TABLE `projectfiles` (
  `file_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `student_id` int(11) NOT NULL,
  `supervisor_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `projects`
--

INSERT INTO `projects` (`project_id`, `title`, `description`, `start_date`, `end_date`, `student_id`, `supervisor_id`, `created_at`) VALUES
(1, 'KP Semen Padang 01', 'Ini adalah batch pertama untuk KP di PT Semen Padang', '2024-05-01', '2024-06-10', 3, 6, '2024-06-20 17:59:20');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','mahasiswa','dosen') NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `profilePicture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `profilePicture`) VALUES
(2, 'Admin', 'admin01@gmail.com', '$2b$10$Ea3oJdornjE/BsuUUwqEWuc9cxAS8j2ctaH5CRoSsRqszT/dq8L7K', 'admin', '2024-06-20 17:54:39', '2024-06-20 17:54:39', NULL),
(3, 'Fadli', 'rajoparmatoalam@gmail.com', '$2b$10$jglGW/UyUC67dynsM5X5quCCqpgU0o1GldLxGqv8bSOMjhAWmVHh.', 'mahasiswa', '2024-06-20 17:57:04', '2024-06-20 18:00:12', '/uploads/3_1718906412907.jpg'),
(4, 'Ziggy', 'ZiggyYafiHisyam@gmail.com', '$2b$10$SxV/4NdGBrQw.0YwdrzPBe.knijXTOrL5N9WD0xIOOC7TG55HFeTO', 'mahasiswa', '2024-06-20 17:57:29', '2024-06-20 18:02:43', '/uploads/4_1718906563419.jpg'),
(5, 'Vina', 'vina@gmail.com', '$2b$10$YbIyrnqPk543CHED91WPve3v4SovXm9szshgrPKXcsZg/G9uk2xoO', 'mahasiswa', '2024-06-20 17:57:44', '2024-06-22 16:45:46', '/uploads/5_1719074746572.jpg'),
(6, 'Dosen', 'dosen01@gmail.com', '$2b$10$NO0RZVuLct4tn/wY/6zhlO6q15CTvtGhqrRVseMkOA./oXQ/56.S.', 'dosen', '2024-06-20 17:58:20', '2024-06-22 16:44:10', '/uploads/6_1719074650282.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `forumposts`
--
ALTER TABLE `forumposts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `thread_id` (`thread_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `forumthreads`
--
ALTER TABLE `forumthreads`
  ADD PRIMARY KEY (`thread_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `logbookcomments`
--
ALTER TABLE `logbookcomments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `entry_id` (`entry_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `logbookentries`
--
ALTER TABLE `logbookentries`
  ADD PRIMARY KEY (`entry_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indeks untuk tabel `projectfiles`
--
ALTER TABLE `projectfiles`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indeks untuk tabel `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `supervisor_id` (`supervisor_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `forumposts`
--
ALTER TABLE `forumposts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `forumthreads`
--
ALTER TABLE `forumthreads`
  MODIFY `thread_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `logbookcomments`
--
ALTER TABLE `logbookcomments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `logbookentries`
--
ALTER TABLE `logbookentries`
  MODIFY `entry_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `projectfiles`
--
ALTER TABLE `projectfiles`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `forumposts` (`post_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `forumposts`
--
ALTER TABLE `forumposts`
  ADD CONSTRAINT `forumposts_ibfk_1` FOREIGN KEY (`thread_id`) REFERENCES `forumthreads` (`thread_id`),
  ADD CONSTRAINT `forumposts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `forumthreads`
--
ALTER TABLE `forumthreads`
  ADD CONSTRAINT `forumthreads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `logbookcomments`
--
ALTER TABLE `logbookcomments`
  ADD CONSTRAINT `logbookcomments_ibfk_1` FOREIGN KEY (`entry_id`) REFERENCES `logbookentries` (`entry_id`),
  ADD CONSTRAINT `logbookcomments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `logbookentries`
--
ALTER TABLE `logbookentries`
  ADD CONSTRAINT `logbookentries_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`);

--
-- Ketidakleluasaan untuk tabel `projectfiles`
--
ALTER TABLE `projectfiles`
  ADD CONSTRAINT `projectfiles_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`);

--
-- Ketidakleluasaan untuk tabel `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
