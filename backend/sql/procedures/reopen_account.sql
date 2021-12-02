DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ReopenAccount`(
	IN account_id BIGINT
)
BEGIN
	DECLARE isDisabled DATETIME;
    
	SELECT disabled_at INTO isDisabled FROM account WHERE account.account_id = account_id;
	IF found_rows() = 0 THEN
		SELECT 'ACCOUNT_NOT_EXIST';
	ELSEIF isDisabled IS NULL THEN
		SELECT 'ACCOUNT_NOT_CLOSED';
	ELSE
		UPDATE account SET account.disabled_at = null WHERE account.account_id = account_id;
		SELECT * FROM account WHERE account.account_id = account_id;
    END IF;
END ;;
DELIMITER ;