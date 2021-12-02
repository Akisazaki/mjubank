DROP TABLE IF EXISTS `transaction`;

CREATE TABLE `transaction` (
  `serial_number` bigint unsigned NOT NULL AUTO_INCREMENT,
  `account_id` bigint unsigned NOT NULL,
  `transaction_type` tinyint unsigned NOT NULL,
  `transaction_date` datetime NOT NULL,
  `note` varchar(64) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `balance_after` decimal(15,2) NOT NULL,
  `counter_party_account` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`serial_number`),
  UNIQUE KEY `serial_number_UNIQUE` (`serial_number`),
  KEY `transaction-account_idx` (`account_id`),
  KEY `list-filter-by-type` (`account_id`,`transaction_type`,`transaction_date` DESC),
  KEY `list` (`account_id`,`transaction_date` DESC),
  KEY `transaction_counter_party-account_idx` (`counter_party_account`),
  CONSTRAINT `transaction-account` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`),
  CONSTRAINT `transaction_counter_party-account` FOREIGN KEY (`counter_party_account`) REFERENCES `account` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3;
