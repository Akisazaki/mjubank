DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `OpenAccount`(
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
END ;;
DELIMITER ;