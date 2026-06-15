-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-04-2026 a las 23:47:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `prog3_turnos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `activo`) VALUES
(1, 'PEDIATRÍA', 1),
(2, 'CLÍNICA', 1),
(3, 'TRAUMATOLOGÍA', 1),
(4, 'INFECTOLOGÍA', 1),
(9, 'NEUROLOGÍA', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_especialidad` int(10) UNSIGNED NOT NULL,
  `matricula` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_consulta` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id_medico`, `id_usuario`, `id_especialidad`, `matricula`, `descripcion`, `valor_consulta`) VALUES
(1, 1, 1, 1000, 'test', 5000.00),
(2, 2, 1, 2000, 'test', 5000.00),
(3, 3, 3, 3000, 'test', 10000.00),
(4, 4, 4, 4000, 'test', 15000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos_obras_sociales`
--

CREATE TABLE `medicos_obras_sociales` (
  `id_medico_obra_social` int(10) UNSIGNED NOT NULL,
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos_obras_sociales`
--

INSERT INTO `medicos_obras_sociales` (`id_medico_obra_social`, `id_medico`, `id_obra_social`, `activo`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 2, 1),
(4, 4, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obras_sociales`
--

CREATE TABLE `obras_sociales` (
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `porcentaje_descuento` decimal(9,2) NOT NULL,
  `es_particular` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `obras_sociales`
--

INSERT INTO `obras_sociales` (`id_obra_social`, `nombre`, `descripcion`, `porcentaje_descuento`, `es_particular`, `activo`) VALUES
(1, 'Jerárquicos', 'jer', 10.00, 0, 1),
(2, 'OSUNER', 'osu', 10.00, 0, 1),
(3, 'OSECAC', 'ose', 11.00, 0, 1),
(4, 'OSUNER 3', 'OSU', 13.00, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `id_usuario`, `id_obra_social`) VALUES
(1, 5, 1),
(2, 6, 2),
(3, 7, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos_reservas`
--

CREATE TABLE `turnos_reservas` (
  `id_turno_reserva` int(10) UNSIGNED NOT NULL,
  `id_medico` int(10) UNSIGNED NOT NULL,
  `id_paciente` int(10) UNSIGNED NOT NULL,
  `id_obra_social` int(10) UNSIGNED NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `atentido` tinyint(3) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `turnos_reservas`
--

INSERT INTO `turnos_reservas` (`id_turno_reserva`, `id_medico`, `id_paciente`, `id_obra_social`, `fecha_hora`, `valor_total`, `atentido`, `activo`) VALUES
(1, 1, 1, 1, '2026-04-01 17:00:00', 4500.00, 0, 1),
(2, 3, 2, 2, '2026-04-01 18:00:00', 9000.00, 0, 1),
(4, 4, 3, 3, '2026-04-01 19:00:00', 13500.00, 0, 1),
(5, 3, 2, 2, '2026-04-14 18:00:00', 9000.00, 0, 1),
(6, 3, 2, 2, '2026-04-21 18:00:00', 9000.00, 0, 1),
(7, 4, 3, 3, '2026-05-07 16:00:00', 133500.00, 0, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `documento` varchar(20) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `foto_path` varchar(255) NOT NULL,
  `rol` tinyint(3) UNSIGNED NOT NULL,
  `activo` tinyint(3) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `documento`, `apellido`, `nombres`, `email`, `contrasenia`, `foto_path`, `rol`, `activo`) VALUES
(1, '31000111', 'Lopez', 'Marcelo', 'lopmar@correo.com', '2a2646782c5b98ee3084c8734c05f870dbd39a8320e0a2d356acb12083d61bef', '', 1, 1),
(2, '31000112', 'Diaz', 'Juan', 'diajua@correo.com', 'efe60972bee3664517525d7abd799fda05ecca0cd4ce583894b86a900782b424', '', 1, 1),
(3, '31000113', 'Benitez', 'Horacio', 'benhor@correo.com', 'eb2209c3ce078113e5dad388f31a6e6d81b3578c500a1dd30a7ebd2d36bed230', '', 1, 1),
(4, '31000114', 'Perez', 'Luis', 'perlui@correo.com', 'e738d2ec597343b44987139c0f056c1341e98f8b3d3814640499a8e74b24a650', '', 1, 1),
(5, '41000111', 'Lopez', 'Jacinto', 'lopjac@correo.com', '79570b42e34bb9e2edc92b9b03982f70653dd11905e7040870a570cfae72b0b0', '', 2, 1),
(6, '41000112', 'Hunk', 'Lorena', 'hunlor@correo.com', '464db19217fabdaabc5add321054f39216d03edfef2efaf8c6769485415b7f25', '', 2, 1),
(7, '41000113', 'Aguirre', 'Brian', 'agubri@correo.com', '2dfa174ae2688ec55d00f57c5a0a7783ba1f0e2981ab7df9f1cf933686c15274', '', 2, 1),
(8, '51000111', 'Fernandez', 'Benito', 'ferben@correo.com', 'f127f4e9e4248f77eaa446ea9bff721e3e79eedf114ba6e1cfc633853ef07b4c', '', 3, 1),
(10, '51000112', 'Gomez', 'Silvia', 'gomsil@correo.com', '601de117008d80e65ffad05dce97462d8f1b1e9aad6d68cf2b289703b8366b52', '', 3, 1);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_medicos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_medicos` (
`id_medico` int(10) unsigned
,`id_usuario` int(10) unsigned
,`apellido` varchar(100)
,`nombres` varchar(100)
,`email` varchar(255)
,`foto_path` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `v_pacientes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `v_pacientes` (
`id_paciente` int(10) unsigned
,`id_usuario` int(10) unsigned
,`apellido` varchar(100)
,`nombres` varchar(100)
,`email` varchar(255)
,`id_obra_social` int(10) unsigned
,`descripcion_obra_social` varchar(255)
,`foto_path` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `v_medicos`
--
DROP TABLE IF EXISTS `v_medicos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_medicos`  AS SELECT `m`.`id_medico` AS `id_medico`, `m`.`id_usuario` AS `id_usuario`, `u`.`apellido` AS `apellido`, `u`.`nombres` AS `nombres`, `u`.`email` AS `email`, `u`.`foto_path` AS `foto_path` FROM (`medicos` `m` join `usuarios` `u` on(`m`.`id_usuario` = `u`.`id_usuario`)) WHERE `u`.`activo` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `v_pacientes`
--
DROP TABLE IF EXISTS `v_pacientes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_pacientes`  AS SELECT `p`.`id_paciente` AS `id_paciente`, `p`.`id_usuario` AS `id_usuario`, `u`.`apellido` AS `apellido`, `u`.`nombres` AS `nombres`, `u`.`email` AS `email`, `os`.`id_obra_social` AS `id_obra_social`, `os`.`descripcion` AS `descripcion_obra_social`, `u`.`foto_path` AS `foto_path` FROM ((`pacientes` `p` join `usuarios` `u` on(`p`.`id_usuario` = `u`.`id_usuario`)) join `obras_sociales` `os` on(`p`.`id_obra_social` = `os`.`id_obra_social`)) WHERE `u`.`activo` = 1 ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id_medico`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `fk_medicos_especialidades` (`id_especialidad`),
  ADD KEY `fk_medicos_usuarios` (`id_usuario`);

--
-- Indices de la tabla `medicos_obras_sociales`
--
ALTER TABLE `medicos_obras_sociales`
  ADD PRIMARY KEY (`id_medico_obra_social`),
  ADD KEY `fk_mos_medico` (`id_medico`),
  ADD KEY `fk_mos_obra_social` (`id_obra_social`);

--
-- Indices de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  ADD PRIMARY KEY (`id_obra_social`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD KEY `fk_pacientes_obras_sociales` (`id_obra_social`),
  ADD KEY `fk_pacientes_usuarios` (`id_usuario`);

--
-- Indices de la tabla `turnos_reservas`
--
ALTER TABLE `turnos_reservas`
  ADD PRIMARY KEY (`id_turno_reserva`),
  ADD KEY `fk_turnos_reservas_pacientes` (`id_paciente`),
  ADD KEY `fk_turnos_reservas_medicos` (`id_medico`),
  ADD KEY `fk_turnos_reservas_obras_sociales` (`id_obra_social`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id_medico` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `medicos_obras_sociales`
--
ALTER TABLE `medicos_obras_sociales`
  MODIFY `id_medico_obra_social` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `obras_sociales`
--
ALTER TABLE `obras_sociales`
  MODIFY `id_obra_social` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `turnos_reservas`
--
ALTER TABLE `turnos_reservas`
  MODIFY `id_turno_reserva` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `fk_medicos_especialidades` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_medicos_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `medicos_obras_sociales`
--
ALTER TABLE `medicos_obras_sociales`
  ADD CONSTRAINT `fk_mos_medico` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mos_obra_social` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `fk_pacientes_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`),
  ADD CONSTRAINT `fk_pacientes_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `turnos_reservas`
--
ALTER TABLE `turnos_reservas`
  ADD CONSTRAINT `fk_turnos_reservas_medicos` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_turnos_reservas_obras_sociales` FOREIGN KEY (`id_obra_social`) REFERENCES `obras_sociales` (`id_obra_social`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_turnos_reservas_pacientes` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;