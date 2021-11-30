SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mjubank
-- -----------------------------------------------------
USE `mjubank`;

-- -----------------------------------------------------
-- Table `mjubank`.`customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mjubank`.`customer` (
  `ssn` BIGINT(11) UNSIGNED NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `birthday` DATE NULL,
  `email` VARCHAR(45) NOT NULL,
  `tel` VARCHAR(15) NULL,
  `job` VARCHAR(45) NULL,
  `password` BINARY(32) NOT NULL,
  `disabled_at` DATETIME NULL,
  `customer_type` TINYINT(4) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`ssn`),
  UNIQUE INDEX `ssn_UNIQUE` (`ssn` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB DEFAULT CHARSET=utf8;


-- -----------------------------------------------------
-- Table `mjubank`.`account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mjubank`.`account` (
  `account_id` BIGINT(32) UNSIGNED NOT NULL,
  `account_type` TINYINT(4) UNSIGNED NOT NULL,
  `balance` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `created_at` DATETIME NOT NULL,
  `ssn` BIGINT(11) UNSIGNED NOT NULL,
  `disabled_at` DATETIME NULL,
  PRIMARY KEY (`account_id`),
  INDEX `account_holder_idx` (`ssn` ASC),
  CONSTRAINT `account_holder`
    FOREIGN KEY (`ssn`)
    REFERENCES `mjubank`.`customer` (`ssn`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB DEFAULT CHARSET=utf8;


-- -----------------------------------------------------
-- Table `mjubank`.`card`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mjubank`.`card` (
  `card_id` BIGINT(18) UNSIGNED NOT NULL,
  `application_date` DATETIME NOT NULL,
  `limit` DECIMAL(15,2) UNSIGNED NULL,
  `payment_at` DATE NULL,
  `card_type` TINYINT(4) UNSIGNED NOT NULL,
  `account_id` BIGINT(32) UNSIGNED NULL,
  `dropped_at` DATETIME NULL,
  PRIMARY KEY (`card_id`),
  INDEX `card-account_idx` (`account_id` ASC),
  CONSTRAINT `card-account`
    FOREIGN KEY (`account_id`)
    REFERENCES `mjubank`.`account` (`account_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB DEFAULT CHARSET=utf8;


-- -----------------------------------------------------
-- Table `mjubank`.`transaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mjubank`.`transaction` (
  `serial_number` BIGINT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `account_id` BIGINT(32) UNSIGNED NOT NULL,
  `transaction_type` TINYINT(4) UNSIGNED NOT NULL,
  `transaction_date` DATETIME NOT NULL,
  `note` VARCHAR(64) NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `balance_after` DECIMAL(15,2) NOT NULL,
  `counter_party_account` BIGINT(32) UNSIGNED NOT NULL,
  PRIMARY KEY (`serial_number`),
  UNIQUE INDEX `serial_number_UNIQUE` (`serial_number` ASC),
  INDEX `transaction-account_idx` (`account_id` ASC),
  INDEX `list-filter-by-type` (`account_id` ASC, `transaction_type` ASC, `transaction_date` DESC),
  INDEX `list` (`account_id` ASC, `transaction_date` DESC),
  CONSTRAINT `transaction-account`
    FOREIGN KEY (`account_id`)
    REFERENCES `mjubank`.`account` (`account_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `transaction-counter-party`
    FOREIGN KEY (`counter_party_account`)
    REFERENCES `mjubank`.`account` (`account_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB DEFAULT CHARSET=utf8;


-- -----------------------------------------------------
-- Table `mjubank`.`card_transaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mjubank`.`card_transaction` (
  `serial_number` BIGINT UNSIGNED NOT NULL,
  `card_id` BIGINT(18) UNSIGNED NOT NULL,
  `card_transaction_date` DATETIME NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `canceled_at` DATETIME NULL,
  PRIMARY KEY (`serial_number`),
  UNIQUE INDEX `serial_number_UNIQUE` (`serial_number` ASC),
  INDEX `card_transaction-card` (`card_id` ASC),
  CONSTRAINT `card_transaction-card`
    FOREIGN KEY (`card_id`)
    REFERENCES `mjubank`.`card` (`card_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB DEFAULT CHARSET=utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
