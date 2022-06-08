# Host: 192.95.55.128  (Version 5.5.5-10.6.7-MariaDB-1:10.6.7+maria~focal)
# Date: 2022-06-08 14:16:06
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "supplies_deliveryl"
#

DROP TABLE IF EXISTS `supplies_deliveryl`;
CREATE TABLE `supplies_deliveryl` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) DEFAULT NULL,
  `op` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `edited` datetime DEFAULT NULL,
  `edited_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

#
# Data for table "supplies_deliveryl"
#

