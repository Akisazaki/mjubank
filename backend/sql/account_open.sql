USE `mjubank`;
DROP procedure IF EXISTS `OpenAccount`;

DELIMITER $$
USE `mjubank`$$
CREATE PROCEDURE `OpenAccount`(
	IN holder_ssn BIGINT,
	IN account_id BIGINT,
    IN account_type TINYINT
)
BEGIN
	SELECT ssn FROM customer WHERE customer.ssn = holder_ssn;
	IF found_rows() = 0 THEN
		SELECT 'HOLDER_DOES_NOT_EXIST';
	ELSE
		SELECT * FROM account WHERE account.account_id = account_id;
        if found_rows() > 0 THEN
			SELECT 'ACCOUNT_ALREADY_EXIST';
		ELSE
			INSERT account values (account_id, account_type, 0, NOW(), holder_ssn, null);
			SELECT * FROM account WHERE account.account_id = account_id;
		END IF;
	END IF;
END$$
DELIMITER ;



/* UNIT TEST */
SET @account_id = 1345862153;
SET @holder_ssn = 21317328758;
SET @account_type = 1;
CALL `OpenAccount`(@holder_ssn, @account_id, @account_type);