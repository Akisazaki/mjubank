DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTransfer`(
	IN account_id BIGINT UNSIGNED,
    IN account_to BIGINT UNSIGNED
)
BEGIN
	IF account_to IS NULL THEN
		SELECT * FROM transaction WHERE transaction.account_id = account_id;
	ELSE
		SELECT * FROM transaction WHERE transaction.account_id = account_id AND transaction.counter_party_account = account_to;
    END IF;
END ;;
DELIMITER ;