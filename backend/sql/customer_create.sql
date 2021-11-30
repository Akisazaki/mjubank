USE `mjubank`;
DROP procedure IF EXISTS `CreateCustomer`;

DELIMITER $$
USE `mjubank`$$
CREATE PROCEDURE `CreateCustomer`(
	IN ssn BIGINT UNSIGNED,
	IN name VARCHAR(45),
    IN address VARCHAR(45),
    IN birthday DATE,
    IN email VARCHAR(45),
    IN tel VARCHAR(15),
    IN job VARCHAR(45),
    IN password BINARY(32),
    IN customer_type TINYINT UNSIGNED
)
BEGIN
	IF ssn IS NULL OR address IS NULL OR email IS NULL THEN
		SELECT 'CUSTOMER_CREATE_FIELD_NOT_VALID';
	ELSEIF (SELECT EXISTS (SELECT 1 FROM customer WHERE customer.ssn = ssn OR customer.email = email)) THEN
		SELECT 'CUSTOMER_ALREADY_EXISTS';
	ELSE
		INSERT customer values (ssn, name, address, birthday, email, tel, job, password, null, customer_type);
		SELECT * FROM customer WHERE customer.ssn = ssn;
	END IF;
END$$
DELIMITER ;



/* UNIT TEST */
/* CALL `CreateCustomer`(41230123, 'Test', 'TestAddress', '1987-07-24', 'test@mjubank.com', '034-243-1131', 'Student', 0x48efc4851e15940af5d477d3c0ce99211a70a3be, 0) */