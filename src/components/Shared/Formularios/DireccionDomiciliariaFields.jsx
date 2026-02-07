import React, { useMemo } from "react";
import {
  getDepartamentos,
  getProvincias,
  getDistritos,
  getTiposVia,
  formatUbigeoLabel,
} from "services/ubigeo/ubigeoRepo";

const DireccionDomiciliariaFields = ({ data, handleChange, inputClass, labelClass }) => {
  const tiposVia = useMemo(() => getTiposVia(), []);
  const departamentos = useMemo(() => getDepartamentos(), []);
  const provincias = useMemo(() => getProvincias(data.departamento), [data.departamento]);
  const distritos = useMemo(
    () => getDistritos(data.departamento, data.provincia),
    [data.departamento, data.provincia]
  );

  const handleAddressChange = (e) => {
    const { name } = e.target;
    handleChange(e);

    if (name === "departamento") {
      handleChange({ target: { name: "provincia", value: "" } });
      handleChange({ target: { name: "distrito", value: "" } });
      return;
    }

    if (name === "provincia") {
      handleChange({ target: { name: "distrito", value: "" } });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div>
        <label className={labelClass}>Tipo de Via</label>
        <select
          name="tipoVia"
          value={data.tipoVia || ""}
          onChange={handleAddressChange}
          className={inputClass}
          required
        >
          <option value="">SELECCIONE...</option>
          {tiposVia.map((tipoVia) => (
            <option key={tipoVia} value={tipoVia}>
              {tipoVia}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Nombre de Via</label>
        <input
          name="nombreVia"
          value={data.nombreVia || ""}
          onChange={handleAddressChange}
          placeholder="Ej: Los Laureles"
          className={inputClass}
          maxLength={150}
          required
        />
      </div>

      <div>
        <label className={labelClass}>N/MZ-LT</label>
        <input
          name="numeroMzLt"
          value={data.numeroMzLt || ""}
          onChange={handleAddressChange}
          placeholder="Ej: 123 / MZ A LT 1"
          className={inputClass}
          maxLength={100}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Urbanizacion/Caserio</label>
        <input
          name="urbanizacion"
          value={data.urbanizacion || ""}
          onChange={handleAddressChange}
          placeholder="Ej: Chocan, La Orca"
          className={inputClass}
          maxLength={150}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Departamento</label>
        <select
          name="departamento"
          value={data.departamento || ""}
          onChange={handleAddressChange}
          className={inputClass}
          required
        >
          <option value="">SELECCIONE...</option>
          {departamentos.map((departamento) => (
            <option key={departamento} value={departamento}>
              {formatUbigeoLabel(departamento)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Provincia</label>
        <select
          name="provincia"
          value={data.provincia || ""}
          onChange={handleAddressChange}
          className={inputClass}
          disabled={!data.departamento}
          required
        >
          <option value="">SELECCIONE...</option>
          {provincias.map((provincia) => (
            <option key={provincia} value={provincia}>
              {formatUbigeoLabel(provincia)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Distrito</label>
        <select
          name="distrito"
          value={data.distrito || ""}
          onChange={handleAddressChange}
          className={inputClass}
          disabled={!data.provincia}
          required
        >
          <option value="">SELECCIONE...</option>
          {distritos.map((distrito) => (
            <option key={distrito} value={distrito}>
              {formatUbigeoLabel(distrito)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DireccionDomiciliariaFields;
