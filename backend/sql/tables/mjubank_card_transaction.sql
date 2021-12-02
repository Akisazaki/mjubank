DROP TABLE IF EXISTS `card_transaction`;

CREATE TABLE `card_transaction` (
  `serial_number` bigint unsigned NOT NULL AUTO_INCREMENT,
  `card_id` bigint unsigned NOT NULL,
  `card_transaction_date` datetime NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `canceled_at` datetime DEFAULT NULL,
  PRIMARY KEY (`serial_number`),
  KEY `card_transaction-card_idx` (`card_id`),
  CONSTRAINT `card_transaction-card` FOREIGN KEY (`card_id`) REFERENCES `card` (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
