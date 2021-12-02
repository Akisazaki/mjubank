DROP TABLE IF EXISTS `card`;

CREATE TABLE `card` (
  `card_id` bigint unsigned NOT NULL,
  `application_date` datetime NOT NULL,
  `limit` decimal(15,2) unsigned DEFAULT NULL,
  `card_type` tinyint unsigned NOT NULL,
  `account_id` bigint unsigned NOT NULL,
  `dropped_at` datetime DEFAULT NULL,
  `expired_at` date NOT NULL,
  PRIMARY KEY (`card_id`),
  KEY `card-account_idx` (`account_id`),
  CONSTRAINT `card-account` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;