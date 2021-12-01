USE `mjubank`;
DROP procedure IF EXISTS `Withdraw`;

DELIMITER $$
USE `mjubank`$$
CREATE PROCEDURE `Withdraw`(
    IN _target BIGINT UNSIGNED,
    IN _amount DECIMAL(15,2)
)
BEGIN
	DECLARE balance_after DECIMAL(15,2);
    
	SELECT balance INTO balance_after FROM account WHERE account_id = _target;
    IF _amount = 0  THEN
		SELECT 'AMOUNT MUST NOT BE ZERO';
	ELSEIF found_rows() = 0 THEN
		SELECT 'ACCOUNT NOT FOUND';
	ELSEIF balance_after < _amount THEN
		SELECT 'LACK_OF_BALANCE';
    ELSE
		SET balance_after = balance_after - _amount;
		INSERT transaction (account_id, transaction_type, transaction_date, amount, balance_after, counter_party_account) values (_target, 1, NOW(), _amount, balance_after, null);
		UPDATE account SET balance = balance_after WHERE account_id = _target;
		SELECT * FROM transaction WHERE serial_number = LAST_INSERT_ID();
    END IF;
END$$
DELIMITER ;