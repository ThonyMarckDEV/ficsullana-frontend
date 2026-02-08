import React, { useMemo } from "react";
import {
  getDepartamentos,
  getProvincias,
  getDistritos,
  getTiposVia,
  formatUbigeoLabel,
} from "services/ubigeo/ubigeoRepo";

const DireccionDomiciliariaFields = ({
  data,
  handleChange,
  inputClass,
  labelClass,
  errors = {},
  touched = {},
  handleBlur,
}) => {
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

  const getFieldClass = (name) =>
    `${inputClass}${touched?.[name] && errors?.[name] ? " border-red-500 focus:ring-red-500" : ""}`;

  const renderError = (name) =>
    touched?.[name] && errors?.[name] ? (
      <p className="text-[11px] text-red-600 mt-1">{errors[name]}</p>
    ) : null;

  const onBlurField = (e) => {
    if (typeof handleBlur === "function") {
      handleBlur(e);
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
          onBlur={onBlurField}
          className={getFieldClass("tipoVia")}
          required
        >
          <option value="">SELECCIONE...</option>
          {tiposVia.map((tipoVia) => (
            <option key={tipoVia} value={tipoVia}>
              {tipoVia}
            </option>
          ))}
        </select>
        {renderError("tipoVia")}
      </div>

      <div>
        <label className={labelClass}>Nombre de Via</label>
        <input
          name="nombreVia"
          value={data.nombreVia || ""}
          onChange={handleAddressChange}
          onBlur={onBlurField}
          placeholder="Ej: Los Laureles"
          className={getFieldClass("nombreVia")}
          maxLength={150}
          required
        />
        {renderError("nombreVia")}
      </div>

      <div>
        <label className={labelClass}>N/MZ-LT</label>
        <input
          name="numeroMzLt"
          value={data.numeroMzLt || ""}
          onChange={handleAddressChange}
          onBlur={onBlurField}
          placeholder="Ej: 123 / MZ A LT 1"
          className={getFieldClass("numeroMzLt")}
          maxLength={100}
          required
        />
        {renderError("numeroMzLt")}
      </div>

      <div>
        <label className={labelClass}>Urbanizacion/Caserio</label>
        <input
          name="urbanizacion"
          value={data.urbanizacion || ""}
          onChange={handleAddressChange}
          onBlur={onBlurField}
          placeholder="Ej: Chocan, La Orca"
          className={getFieldClass("urbanizacion")}
          maxLength={150}
          required
        />
        {renderError("urbanizacion")}
      </div>

      <div>
        <label className={labelClass}>Departamento</label>
        <select
          name="departamento"
          value={data.departamento || ""}
          onChange={handleAddressChange}
          onBlur={onBlurField}
          className={getFieldClass("departamento")}
          required
        >
          <option value="">SELECCIONE...</option>
          {departamentos.map((departamento) => (
            <option key={departamento} value={departamento}>
              {formatUbigeoLabel(departamento)}
            </option>
          ))}
        </select>
        {renderError("departamento")}
      </div>

      <div>
        <label className={labelClass}>Provincia</label>
        <select
          name="provincia"
          value={data.provincia || ""}
          onChange={handleAddressChange}
          onBlur={onBlurField}
          className={getFieldClass("provincia")}
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
        {renderError("provincia")}
      </div>

      <div>
        <label className={labelClass}>Distrito</label>
        <select
          name="distrito"
          value={data.distrito || ""}
          onChange={handleAddressChange}
          onBlur={onBlurField}
          className={getFieldClass("distrito")}
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
        {renderError("distrito")}
      </div>
    </div>
  );
};

export default DireccionDomiciliariaFields;
