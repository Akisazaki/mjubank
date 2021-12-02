DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `account_id` bigint unsigned NOT NULL,
  `account_type` tinyint unsigned NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL,
  `ssn` bigint unsigned NOT NULL,
  `disabled_at` datetime DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  KEY `account_holder_idx` (`ssn`),
  CONSTRAINT `account_holder` FOREIGN KEY (`ssn`) REFERENCES `customer` (`ssn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;