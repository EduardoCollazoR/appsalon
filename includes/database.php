<?php
$db = mysqli_connect('localhost', 'root', '', 'appsalon');

if (!$db) {
    echo "Error en la conexion";
    exit;
} 

// echo "Conexion correcta";
