-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2022 at 11:06 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sourcesagedb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addimages` (IN `pid` INT, IN `vpath` VARCHAR(512))  NO SQL
INSERT INTO timages (productid, path) VALUES (pid,vpath)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addimagesvariant` (IN `vid` INT, IN `vpath` VARCHAR(200))  NO SQL
INSERT INTO timagesvariant (variantid, path) VALUES (vid,vpath)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addlogo` (IN `pid` INT, IN `vpath` VARCHAR(200))  NO SQL
INSERT INTO tlogos (productid, path) VALUES (pid,vpath)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addproduct` (IN `vName` VARCHAR(100), IN `vDesc` VARCHAR(512), IN `vDc` DATE, IN `vDu` DATE)  NO SQL
INSERT INTO tproducts (name,descr,logo_id,created_at,update_at) VALUES (vName,vDesc,0,vDc,vDu)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addvariant` (IN `vName` VARCHAR(200), IN `vSize` VARCHAR(20), IN `vColor` VARCHAR(20), IN `vD` DATE, IN `pid` INT)  NO SQL
INSERT INTO tvariants (productid, name,size,color,created_at,updated_at) VALUES (pid,vName,vSize,vColor,vD,vD)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_allproducts` ()  SELECT tproducts.productid, tproducts.name, tproducts.descr, tlogos.path, tproducts.created_at, tproducts.update_at from tproducts,tlogos where tproducts.logo_id=tlogos.logo_id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_allvariants` (IN `pid` INT)  NO SQL
SELECT tvariants.variantid, tvariants.name, tvariants.size, tvariants.color, tvariants.created_at, tvariants.updated_at FROM tvariants WHERE tvariants.productid = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_changelogo` (IN `pid` INT, IN `nF` VARCHAR(100))  NO SQL
UPDATE tlogos set tlogos.path = nF where tlogos.productid=pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_changeproductdescr` (IN `dat` VARCHAR(100), IN `cdate` DATE, IN `pid` INT)  NO SQL
UPDATE tproducts set tproducts.descr = dat, tproducts.update_at = cdate where tproducts.productid = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_changeproductname` (IN `dat` VARCHAR(100), IN `cdate` DATE, IN `pid` INT)  NO SQL
UPDATE tproducts set tproducts.name = dat, tproducts.update_at = cdate where tproducts.productid = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_changevariantcolor` (IN `vid` INT, IN `clr` VARCHAR(10))  NO SQL
update tvariants set tvariants.color=clr where tvariants.variantid=vid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_changevariantname` (IN `vid` INT, IN `nm` VARCHAR(100))  NO SQL
update tvariants set tvariants.name=nm where tvariants.variantid=vid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_changevariantproduct` (IN `vid` INT, IN `pid` INT)  NO SQL
update tvariants set tvariants.productid=pid where tvariants.variantid=vid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_changevariantsize` (IN `vid` INT, IN `sz` VARCHAR(10))  NO SQL
update tvariants set tvariants.size=sz where tvariants.variantid=vid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delimage` (IN `pid` INT(5))  BEGIN
	DELETE from timages where timages.productid=pid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dellogo` (IN `pid` INT(5))  BEGIN
	DELETE from tlogos where tlogos.productid=pid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delproduct` (IN `pid` INT(5))  BEGIN
	CALL sp_dellogo(pid);
    CALL sp_delimage(pid);
	DELETE from tproducts where tproducts.productid=pid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delvariant` (IN `vid` INT)  NO SQL
BEGIN
    CALL sp_delvariantimage(vid);
	DELETE from tvariants where tvariants.variantid=vid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delvariantimage` (IN `vid` INT)  NO SQL
delete from timagesvariant where timagesvariant.variantid=vid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getimagesvariant` (IN `vid` INT)  NO SQL
SELECT timagesvariant.imageid, timagesvariant.path from timagesvariant where timagesvariant.variantid=vid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getparticularvariant` (IN `vid` INT)  NO SQL
SELECT tvariants.productid, tvariants.name, tvariants.size, tvariants.color from tvariants where tvariants.variantid=vid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_maxlogoid` ()  NO SQL
SELECT max(tlogos.logo_id) as maxlogoid FROM tlogos$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_maxproductid` ()  NO SQL
SELECT max(tproducts.productid) as maxpid FROM tproducts$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_maxvariantid` ()  NO SQL
SELECT max(tvariants.variantid) as maxvid FROM tvariants$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_partproduct` (IN `pid` INT(6))  BEGIN
	SELECT tproducts.productid, tproducts.name, tproducts.descr, tlogos.path, tproducts.created_at, tproducts.update_at from tproducts, tlogos where tproducts.logo_id=tlogos.logo_id and tproducts.productid=pid;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_showlogo` (IN `pid` INT)  NO SQL
SELECT tlogos.path from tlogos, tproducts where tlogos.productid=tproducts.productid and tproducts.productid = pid$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_updatelogoid` (IN `logoid` INT, IN `productid` INT)  NO SQL
UPDATE tproducts set tproducts.logo_id = logoid where tproducts.productid = productid$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `timages`
--

CREATE TABLE `timages` (
  `imagesid` bigint(20) UNSIGNED NOT NULL,
  `productid` int(11) NOT NULL,
  `path` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `timages`
--

INSERT INTO `timages` (`imagesid`, `productid`, `path`) VALUES
(32, 69, '32EAC210.jpg'),
(33, 69, '7486C059.jpg'),
(34, 69, '45A1C8E7.jpg'),
(35, 70, 'A498DC49.jpg'),
(36, 70, '49EC727D.png'),
(37, 70, 'A7BBEC5E.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `timagesvariant`
--

CREATE TABLE `timagesvariant` (
  `imageid` bigint(20) UNSIGNED NOT NULL,
  `path` varchar(200) NOT NULL,
  `variantid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `timagesvariant`
--

INSERT INTO `timagesvariant` (`imageid`, `path`, `variantid`) VALUES
(1, '78845CA9.jpg', 2),
(2, '3C3A2E45.png', 2),
(3, '6F771365.jpg', 2),
(4, '44C47E27.jpg', 3),
(5, '357C19C7.png', 3),
(6, '9C4592F7.jpg', 3),
(10, '5AE4B0F0.jpg', 5),
(11, '57690E64.png', 5),
(12, '64870239.jpg', 6),
(13, 'C8BED468.jpg', 6);

-- --------------------------------------------------------

--
-- Table structure for table `tlogos`
--

CREATE TABLE `tlogos` (
  `logo_id` bigint(20) UNSIGNED NOT NULL,
  `productid` int(11) NOT NULL,
  `path` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tlogos`
--

INSERT INTO `tlogos` (`logo_id`, `productid`, `path`) VALUES
(41, 69, '8CB31E90.jpg'),
(42, 70, '9C65E71E.png');

-- --------------------------------------------------------

--
-- Table structure for table `tproducts`
--

CREATE TABLE `tproducts` (
  `productid` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `descr` varchar(1024) NOT NULL,
  `logo_id` int(11) NOT NULL,
  `created_at` date NOT NULL,
  `update_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tproducts`
--

INSERT INTO `tproducts` (`productid`, `name`, `descr`, `logo_id`, `created_at`, `update_at`) VALUES
(69, 'bujang', 'new description', 41, '2022-04-19', '2022-04-19'),
(70, 'kancil', 'new kancil', 42, '2022-04-19', '2022-04-19');

-- --------------------------------------------------------

--
-- Table structure for table `tvariants`
--

CREATE TABLE `tvariants` (
  `variantid` bigint(20) UNSIGNED NOT NULL,
  `productid` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `size` varchar(50) NOT NULL,
  `color` varchar(10) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tvariants`
--

INSERT INTO `tvariants` (`variantid`, `productid`, `name`, `size`, `color`, `created_at`, `updated_at`) VALUES
(5, 70, 'V1111', '34', 'Red', '2022-04-20', '2022-04-20'),
(6, 70, 'V2', 'Grey', 'Red', '2022-04-20', '2022-04-20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `timages`
--
ALTER TABLE `timages`
  ADD UNIQUE KEY `imagesid` (`imagesid`);

--
-- Indexes for table `timagesvariant`
--
ALTER TABLE `timagesvariant`
  ADD UNIQUE KEY `imageid` (`imageid`);

--
-- Indexes for table `tlogos`
--
ALTER TABLE `tlogos`
  ADD UNIQUE KEY `logo_id` (`logo_id`);

--
-- Indexes for table `tproducts`
--
ALTER TABLE `tproducts`
  ADD UNIQUE KEY `productid` (`productid`);

--
-- Indexes for table `tvariants`
--
ALTER TABLE `tvariants`
  ADD UNIQUE KEY `variantid` (`variantid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `timages`
--
ALTER TABLE `timages`
  MODIFY `imagesid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `timagesvariant`
--
ALTER TABLE `timagesvariant`
  MODIFY `imageid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tlogos`
--
ALTER TABLE `tlogos`
  MODIFY `logo_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `tproducts`
--
ALTER TABLE `tproducts`
  MODIFY `productid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `tvariants`
--
ALTER TABLE `tvariants`
  MODIFY `variantid` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
