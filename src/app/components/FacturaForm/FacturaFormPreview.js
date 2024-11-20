import React from 'react';
import {
    Box, Typography, Grid, TextField, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, CircularProgress, Icon
} from '@material-ui/core';
import moment from 'moment';

const FacturaFormPreview = ({
    tipos_documentos,
    tipos_transacciones,
    tipos_contribuyentes,
    tipos_impuestos,
    monedas,
    condiciones_operaciones,
    tipos_operaciones,
    indicadores_presencia,
    tipos_naturaleza_receptor,
    unidades_medida,
    formData,
    desc_sucursal,
    nro_secuencia,
    classes,
    formatNumber,
    isRucVisible
}) => {

    let tipo_documento = formData.cabecera.tipo_documento ? tipos_documentos.find(item => item.codigo.toString() === formData.cabecera.tipo_documento.toString()) : null;
    let tipo_transaccion = formData.cabecera.tipo_transaccion_id ? tipos_transacciones.find(item => item.codigo.toString() === formData.cabecera.tipo_transaccion_id.toString()) : null;
    let tipo_contribuyente = formData.cliente.tipo_contribuyente ? tipos_contribuyentes.find(item => item.codigo.toString() === formData.cliente.tipo_contribuyente.toString()) : null;
    let condicion_operacion = formData.cabecera.condicion_operacion_id ? condiciones_operaciones.find(item => item.codigo.toString() === formData.cabecera.condicion_operacion_id.toString()) : null;
    let naturaleza_receptor = formData.cliente.naturaleza ? tipos_naturaleza_receptor.find(item => item.codigo.toString() === formData.cliente.naturaleza.toString()) : null;
    let moneda = formData.cabecera.moneda_id ? monedas.find(item => item.codigo.toString() === formData.cabecera.moneda_id.toString()) : null;
    let indicador_presencia = formData.cabecera.indicador_presencia ? indicadores_presencia.find(item => item.codigo.toString() === formData.cabecera.indicador_presencia.toString()) : null;

    return (
        <Box>
            <form>
                <Typography variant="h6" gutterBottom>
                    Datos de la Factura
                </Typography>

                <Grid container spacing={2} className={classes.inputContainer}>
                    {/* Sucursal */}
                    <Grid item xs={12} md={1}>
                        <TextField
                            label="Sucursal"
                            value={formData.cabecera.dest}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Desc Sucursal */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Descripción"
                            value={desc_sucursal}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Punto de Expedición */}
                    <Grid item xs={12} md={1}>
                        <TextField
                            label="Punto Exp."
                            value={formData.cabecera.dpunexp}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Nro de secuencia */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="nro_secuencia"
                            label="Nro Secuencia"
                            value={nro_secuencia}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Fecha de Emisión */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Fecha Emisión"
                            value={moment(formData.cabecera.dfeemide).format('DD/MM/YYYY HH:mm:ss')}
                            disabled
                        />
                    </Grid>

                    {/* Moneda */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Moneda"
                            value={moneda.descripcion}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Condición de la operación */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Condición de la operación"
                            value={condicion_operacion.descripcion}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Tipo de Transacción */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Tipo de Transacción"
                            value={tipo_transaccion.descripcion}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Indicar de Presencia */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Indicar de Presencia"
                            value={indicador_presencia.descripcion}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>
                    Datos del Cliente
                </Typography>

                <Grid container spacing={2} className={classes.inputContainer}>
                    {/* Naturaleza Receptor */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Naturaleza Receptor"
                            value={naturaleza_receptor.descripcion}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {isRucVisible ? (
                        <>

                            {/* Tipo Contribuyente */}
                            <Grid item xs={12} md={2}>
                                <TextField
                                    label="Tipo contribuyente"
                                    value={tipo_contribuyente.descripcion}
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>

                            {/* RUC y DV */}
                            <Grid item xs={12} md={2}>
                                <TextField
                                    label="RUC"
                                    value={formData.cliente.ruc}
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} md={1}>
                                <TextField
                                    label="DV"
                                    value={formData.cliente.dv}
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>

                        </>

                    ) : (
                        <>
                            {/* Tipo de Documento y Número de Documento si naturaleza es 2 */}
                            <Grid item xs={12} md={2}>
                                <TextField
                                    label="Tipo de Documento"
                                    value={tipo_documento.descripcion}
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    name="nro_documento"
                                    label="Número de Documento"
                                    value={formData.cliente.nro_documento}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </>
                    )}

                    {/* Razón Social */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Razón Social"
                            value={formData.cliente.razon_social}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Email"
                            value={formData.cliente.email}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Telefono */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Teléfono"
                            value={formData.cliente.telefono}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Celular */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="Celular"
                            value={formData.cliente.celular}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>
                    Detalles de la Factura
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Porc. IVA</TableCell>
                                <TableCell>Uni. Med.</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Prec. Uni.</TableCell>
                                <TableCell>Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formData.Detalles.map((detalle, index) => (
                                <TableRow key={index}>
                                    <TableCell>{detalle.dcodint}</TableCell>
                                    <TableCell>{detalle.ddesproser}</TableCell>
                                    <TableCell>{detalle.dtasiva}</TableCell>
                                    <TableCell>{unidades_medida.find(um => um.codigo === detalle.cunimed)?.descripcion}</TableCell>
                                    <TableCell>{detalle.dcantproser}</TableCell>
                                    <TableCell>{formatNumber(formData.cabecera.moneda_id, detalle.duniproser, 0)}</TableCell>
                                    <TableCell>{formatNumber(formData.cabecera.moneda_id, detalle.dtotbruopeitem, 0)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box mt={4}>
                    <Typography variant="h6">Subtotales</Typography>
                    <Grid container spacing={2} className={classes.inputContainer}>
                        {/* dsubexe */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Subtotal Exento"
                                name="dsubexe"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dsubexe, 0) || formData.Subtotales.dsubexe}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dsub5 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Subtotal 5%"
                                name="dsub5"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dsub5, 0) || formData.Subtotales.dsub5}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dsub10 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Subtotal 10%"
                                name="dsub10"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dsub10, 0) || formData.Subtotales.dsub10}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dtotope */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Total Operación"
                                name="dtotope"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dtotope, 0) || formData.Subtotales.dtotope}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* diva5 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="IVA 5%"
                                name="diva5"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.diva5, 0) || formData.Subtotales.diva5}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* diva10 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="IVA 10%"
                                name="diva10"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.diva10, 0) || formData.Subtotales.diva10}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dliqtotiva5 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Liquidación IVA 5%"
                                name="dliqtotiva5"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dliqtotiva5, 0) || formData.Subtotales.dliqtotiva5}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dliqtotiva10 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Liquidación IVA 10%"
                                name="dliqtotiva10"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dliqtotiva10, 0) || formData.Subtotales.dliqtotiva10}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dtotiva */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Total IVA"
                                name="dtotiva"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dtotiva, 0) || formData.Subtotales.dtotiva}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dbasegrav5 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Base Gravada 5%"
                                name="dbasegrav5"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dbasegrav5, 0) || formData.Subtotales.dbasegrav5}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dbasegrav10 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Base Gravada 10%"
                                name="dbasegrav10"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dbasegrav10, 0) || formData.Subtotales.dbasegrav10}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dtbasgraiva */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Total Base Gravada IVA"
                                name="dtbasgraiva"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dtbasgraiva, 0) || formData.Subtotales.dtbasgraiva}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dtotgralope */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Total General de la Operación"
                                name="dtotgralope"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dtotgralope, 0) || formData.Subtotales.dtotgralope}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
};

export default FacturaFormPreview;
