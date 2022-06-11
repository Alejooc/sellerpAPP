# Host: 192.95.55.128  (Version 5.5.5-10.6.7-MariaDB-1:10.6.7+maria~focal)
# Date: 2022-06-08 14:16:16
# Generator: MySQL-Front 6.1  (Build 1.26)


#
# Structure for table "supplies_deliverys"
#

DROP TABLE IF EXISTS `supplies_deliverys`;
CREATE TABLE `supplies_deliverys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

#
# Data for table "supplies_deliverys"
#

INSERT INTO `supplies_deliverys` VALUES (1,'Creado'),(2,'Despachado'),(3,'Ensanblado'),(4,'Cancelado');
