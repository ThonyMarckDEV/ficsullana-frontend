import React from 'react';
import ProductoSearchSelect from 'components/Shared/Comboboxes/ProductoSearchSelect';
import { formatSectionTitle } from './sectionTitle';

const baseInputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const ProductoSection = ({ form, disabled, setField, catalogos, sectionNumber }) => (
  <section className="bg-white border border-slate-200 rounded-xl p-5">
    <h3 className="text-sm font-black uppercase text-slate-700 mb-4">{formatSectionTitle(sectionNumber, 'Producto')}</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <ProductoSearchSelect
          options={catalogos.productos || []}
          selectedId={form.producto_id}
          onSelect={(producto) => setField('producto_id', producto?.id || '')}
          disabled={disabled}
          label="Producto"
          placeholder="Buscar producto..."
        />
      </div>

      <div>
        <label htmlFor="evaluacion-expuesto-rcc" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Expuesto al RCC</label>
        <input
          id="evaluacion-expuesto-rcc"
          className={baseInputClass}
          value={form.expuesto_rcc ? 'SI' : 'NO'}
          disabled={disabled}
          readOnly
        />
      </div>
    </div>
  </section>
);

export default ProductoSection;
