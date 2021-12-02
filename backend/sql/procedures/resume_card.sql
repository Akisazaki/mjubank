DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ResumeCard`(
	IN _card_id BIGINT UNSIGNED
)
BEGIN
	DECLARE _dropped_at DateTime;
	SELECT card.dropped_at INTO _dropped_at FROM card WHERE card.card_id=_card_id;
    IF found_rows() = 0 THEN
		SELECT 'CARD NOT FOUND';
    ELSEIF _dropped_at IS NULL THEN
		SELECT 'CARD ALREADY RESUMED';
	ELSE
		UPDATE card SET card.dropped_at=null WHERE card.card_id=_card_id;
        SELECT * FROM card WHERE card.card_id=_card_id;
    END IF;
END ;;
DELIMITER ;