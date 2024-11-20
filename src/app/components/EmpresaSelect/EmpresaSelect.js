import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmpresaId } from '../store/fuse/empresaSlice';
import { selectEmpresaId } from '../store/selectors/empresaSelectors';

const EmpresaSelect = ({ empresas }) => {
  const dispatch = useDispatch();
  const selectedEmpresaId = useSelector(selectEmpresaId);

  const handleChange = (event) => {
    dispatch(setEmpresaId(event.target.value));
  };

  return (
    <select value={selectedEmpresaId || ''} onChange={handleChange}>
      <option value="" disabled>Select Empresa</option>
      {empresas.map((empresa) => (
        <option key={empresa.id} value={empresa.id}>
          {empresa.nombre}
        </option>
      ))}
    </select>
  );
};

export default EmpresaSelect;
