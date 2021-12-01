USE `mjubank`;
DROP procedure IF EXISTS `GetTransfer`;

DELIMITER $$
USE `mjubank`$$
CREATE PROCEDURE `GetTransfer`(
	IN account_id BIGINT UNSIGNED,
    IN account_to BIGINT UNSIGNED
)
BEGIN
	IF account_to IS NULL THEN
		SELECT * FROM transaction WHERE transaction.account_id = account_id;
	ELSE
		SELECT * FROM transaction WHERE transaction.account_id = account_id AND transaction.counter_party_account = account_to;
    END IF;
END$$
DELIMITER ;



/* UNIT TEST */
SET @account_id = 1345862152;
SET @account_to = 1345862154;
/* CALL `GetTransfer`(@account_id, NULL); */
CALL `GetTransfer`(@account_id, @account_to);