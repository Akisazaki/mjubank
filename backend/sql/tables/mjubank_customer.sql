DROP TABLE IF EXISTS `customer`;

CREATE TABLE `customer` (
  `ssn` bigint unsigned NOT NULL,
  `name` varchar(45) NOT NULL,
  `address` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `tel` varchar(15) DEFAULT NULL,
  `job` varchar(45) DEFAULT NULL,
  `password` binary(32) NOT NULL,
  `disabled_at` datetime DEFAULT NULL,
  `customer_type` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`ssn`),
  UNIQUE KEY `ssn_UNIQUE` (`ssn`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
