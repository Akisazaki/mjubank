USE `mjubank`;
DROP procedure IF EXISTS `CloseAccount`;

DELIMITER $$
USE `mjubank`$$
CREATE PROCEDURE `CloseAccount`(
	IN account_id BIGINT
)
BEGIN
	DECLARE isDisabled DATETIME;
    
	SELECT disabled_at INTO isDisabled FROM account WHERE account.account_id = account_id;
	IF found_rows() = 0 THEN
		SELECT 'ACCOUNT_NOT_EXIST';
	ELSEIF isDisabled IS NOT NULL THEN
		SELECT 'ALREADY_CLOSED';
	ELSE
		UPDATE account SET account.disabled_at = NOW() WHERE account.account_id = account_id;
		SELECT * FROM account WHERE account.account_id = account_id;
    END IF;
END$$
DELIMITER ;



/* UNIT TEST */
SET @account_id = 1345862151;
CALL `CloseAccount`(@account_id);