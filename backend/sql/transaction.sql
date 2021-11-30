USE `mjubank`;
DROP procedure IF EXISTS `Transfer`;

DELIMITER $$
USE `mjubank`$$
CREATE PROCEDURE `Transfer`(
	IN _from BIGINT,
    IN _to BIGINT,
    IN _amount DECIMAL(15,2)
)
BEGIN
	DECLARE balance_from DECIMAL(15,2);
	DECLARE balance_to DECIMAL(15,2);
    
	SELECT balance INTO balance_from FROM account WHERE account_id = _from;
    IF found_rows() = 0 THEN
		SELECT 'FROM ACCOUNT NOT FOUND';
    ELSEIF balance_from >= _amount THEN
		SET balance_from = balance_from - _amount;
        SELECT balance INTO balance_to FROM account WHERE account_id = _to;
        IF found_rows() = 0 THEN
			SELECT 'TO ACCOUNT NOT FOUND';
		ELSE
			SET balance_to = balance_to + _amount;
			INSERT transaction (account_id, transaction_type, transaction_date, amount, balance_after, counter_party_account) values (_from, 0, NOW(), _amount, balance_from, _to);
			UPDATE account SET balance = balance_to WHERE account_id = _to;
			UPDATE account SET balance = balance_from WHERE account_id = _from;
			SELECT * FROM transaction WHERE serial_number = LAST_INSERT_ID();
		END IF;
	ELSE
		SELECT 'LACK_OF_BALANCE';
    END IF;
END$$
DELIMITER ;


SET @_from   = 1345862154;
SET @_to     = 1345862152;
SET @_amount = 1000;
SET @_result = NULL;

CALL `Transfer`(@_from, @_to, @_amount);