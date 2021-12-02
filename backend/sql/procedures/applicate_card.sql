DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ApplicateCard`(
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
END ;;
DELIMITER ;
