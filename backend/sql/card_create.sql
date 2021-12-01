USE `mjubank`;
DROP procedure IF EXISTS `ApplicateCard`;

DELIMITER $$
USE `mjubank`$$
CREATE PROCEDURE `ApplicateCard`(
	IN _card_id BIGINT UNSIGNED,
	IN _account_id BIGINT UNSIGNED,
	IN _limit DECIMAL(15, 2),
    IN _type TINYINT UNSIGNED
)
BEGIN
	IF _card_id IS NULL OR _account_id IS NULL OR _type IS NULL THEN
		SELECT 'CARD_CREATE_FIELD_NOT_VALID';
	ELSEIF (SELECT EXISTS (SELECT 1 FROM card WHERE card.card_id = _card_id)) THEN
		SELECT 'CARD_ALREADY_EXISTS';
	ELSE
		INSERT card values (_card_id, NOW(), _limit, _type, _account_id, null, DATE_ADD(NOW(), INTERVAL 10 YEAR));
		SELECT * FROM card WHERE card.card_id = _card_id;
	END IF;
END$$
DELIMITER ;



/* UNIT TEST */
/* CALL `CreateCustomer`(41230123, 'Test', 'TestAddress', '1987-07-24', 'test@mjubank.com', '034-243-1131', 'Student', 0x48efc4851e15940af5d477d3c0ce99211a70a3be, 0) */