-- ============================================================
-- STORED PROCEDURE: sp_estadisticas
-- Genera 3 resultsets:
--   1. Resumen general del mes anterior
--   2. Estadísticas por obra social
--   3. Estadísticas por especialidad (el que ya tenían)
-- ============================================================
 
DROP PROCEDURE IF EXISTS sp_estadisticas;
 
DELIMITER $$
 
CREATE PROCEDURE sp_estadisticas()
BEGIN
 
    -- Resultset 1: resumen general del mes anterior
    SELECT
        COUNT(tr.id_turno_reserva)          AS total_turnos,
        SUM(tr.atentido)                    AS turnos_atendidos,
        COUNT(tr.id_turno_reserva)
            - SUM(tr.atentido)              AS turnos_pendientes,
        COALESCE(SUM(tr.valor_total), 0)    AS facturacion_total,
        COUNT(DISTINCT tr.id_paciente)      AS pacientes_atendidos,
        COUNT(DISTINCT tr.id_medico)        AS medicos_activos
    FROM turnos_reservas tr
    WHERE MONTH(tr.fecha_hora) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
      AND YEAR(tr.fecha_hora)  = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
      AND tr.activo = 1;
 
    -- Resultset 2: estadísticas por obra social
    SELECT
        os.id_obra_social,
        os.nombre                           AS obra_social,
        os.es_particular,
        COUNT(tr.id_turno_reserva)          AS cantidad_turnos,
        COALESCE(SUM(tr.valor_total), 0)    AS facturacion_total
    FROM obras_sociales os
    LEFT JOIN turnos_reservas tr
        ON os.id_obra_social = tr.id_obra_social
        AND MONTH(tr.fecha_hora) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
        AND YEAR(tr.fecha_hora)  = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
        AND tr.activo = 1
    WHERE os.activo = 1
    GROUP BY os.id_obra_social, os.nombre, os.es_particular
    ORDER BY cantidad_turnos DESC;
 
    -- Resultset 3: estadísticas por especialidad (el que ya tenían, con YEAR agregado)
    SELECT
        e.id_especialidad,
        e.nombre                            AS especialidad,
        COUNT(tr.id_turno_reserva)          AS cantidad_turnos,
        COALESCE(SUM(tr.valor_total), 0)    AS facturacion_total
    FROM especialidades e
    LEFT JOIN medicos m
        ON e.id_especialidad = m.id_especialidad
    LEFT JOIN turnos_reservas tr
        ON m.id_medico = tr.id_medico
        AND MONTH(tr.fecha_hora) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
        AND YEAR(tr.fecha_hora)  = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
        AND tr.activo = 1
    WHERE e.activo = 1
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY cantidad_turnos DESC;
 
END$$
 
DELIMITER ;