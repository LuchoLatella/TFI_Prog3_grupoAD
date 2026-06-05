DELIMITER //

CREATE PROCEDURE sp_estadisticas()
BEGIN
    SELECT
        COUNT(*) AS total_turnos,
        SUM(atentido) AS turnos_atendidos,
        COUNT(*) - SUM(atentido) AS turnos_pendientes,
        SUM(valor_total) AS recaudacion_total
    FROM turnos_reservas
    WHERE activo = 1;

    SELECT
        os.nombre AS obra_social,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        SUM(tr.valor_total) AS total_recaudado
    FROM turnos_reservas tr
    JOIN obras_sociales os ON tr.id_obra_social = os.id_obra_social
    WHERE tr.activo = 1
    GROUP BY os.id_obra_social, os.nombre;

    SELECT
        e.nombre AS especialidad,
        COUNT(tr.id_turno_reserva) AS cantidad_turnos,
        SUM(tr.valor_total) AS total_recaudado
    FROM turnos_reservas tr
    JOIN medicos m ON tr.id_medico = m.id_medico
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE tr.activo = 1
    GROUP BY e.id_especialidad, e.nombre;
END //

DELIMITER ;
