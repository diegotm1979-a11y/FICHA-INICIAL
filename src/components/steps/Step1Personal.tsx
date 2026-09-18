import React from 'react';
import { PlayerData, FOOTBALL_POSITIONS } from '../../types';
import { User, Phone, Mail, Heart, Baby, Shield, Hash } from 'lucide-react';

interface Step1Props {
  data: PlayerData;
  onChange: (fields: Partial<PlayerData>) => void;
  errors: Record<string, string>;
}

export const Step1Personal: React.FC<Step1Props> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-red-600" />
          Datos Personales y Familiares
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nombre completo */}
        <div className="sm:col-span-2 space-y-2">
          <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800">
            Nombre completo <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="Ej. Carlos Mendoza Gil"
              className={`w-full min-h-[48px] px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
                errors.fullName
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
              }`}
            />
          </div>
          {errors.fullName && <p className="text-xs text-red-600 font-medium">{errors.fullName}</p>}
        </div>

        {/* Apodo / Nombre deportivo */}
        <div className="space-y-2">
          <label htmlFor="nickname" className="block text-sm font-semibold text-slate-800">
            Apodo / Nombre deportivo <span className="text-xs font-normal text-slate-500">(Opcional)</span>
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={data.nickname}
            onChange={(e) => onChange({ nickname: e.target.value })}
            placeholder="Ej. Charlie, El Rayo"
            className="w-full min-h-[48px] px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-2xs"
          />
        </div>

        {/* Dorsal y Posición habitual */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2 col-span-1">
            <label htmlFor="dorsal" className="block text-sm font-semibold text-slate-800 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-red-600" />
              Dorsal
            </label>
            <input
              type="text"
              id="dorsal"
              name="dorsal"
              maxLength={3}
              value={data.dorsal || ''}
              onChange={(e) => onChange({ dorsal: e.target.value })}
              placeholder="Ej. 10"
              className="w-full min-h-[48px] px-3 py-3 text-center bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-2xs"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label htmlFor="position" className="block text-sm font-semibold text-slate-800 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-red-600" />
              Posición habitual
            </label>
            <select
              id="position"
              name="position"
              value={data.position || ''}
              onChange={(e) => onChange({ position: e.target.value })}
              className="w-full min-h-[48px] px-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-2xs"
            >
              {FOOTBALL_POSITIONS.map((pos) => (
                <option key={pos} value={pos} className="bg-white text-slate-900">
                  {pos}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Teléfono móvil */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-red-600" />
            Teléfono móvil <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="Ej. +34 600 123 456"
            className={`w-full min-h-[48px] px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
              errors.phone
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
            }`}
          />
          {errors.phone && <p className="text-xs text-red-600 font-medium">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-red-600" />
            Dirección de correo electrónico <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Ej. jugador@correo.com"
            className={`w-full min-h-[48px] px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
              errors.email
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
            }`}
          />
          {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email}</p>}
        </div>

        {/* ¿Tienes pareja? */}
        <div className="sm:col-span-2 p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-600" />
              ¿Tienes pareja? <span className="text-red-600">*</span>
            </span>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                id="partner-yes-btn"
                onClick={() => onChange({ hasPartner: true })}
                className={`min-h-[44px] min-w-[76px] px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  data.hasPartner === true
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-2xs'
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                id="partner-no-btn"
                onClick={() => onChange({ hasPartner: false })}
                className={`min-h-[44px] min-w-[76px] px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  data.hasPartner === false
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/25 ring-2 ring-red-400/30'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-red-400 shadow-2xs'
                }`}
              >
                No
              </button>
            </div>
          </div>
          {errors.hasPartner && <p className="text-xs text-red-600 font-medium">{errors.hasPartner}</p>}
        </div>

        {/* Hijos */}
        <div className="sm:col-span-2 p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
              <Baby className="w-4 h-4 text-red-600" />
              Hijos
            </span>

            <div className="grid grid-cols-4 gap-2 self-start sm:self-auto">
              {[
                { val: 0, label: '0' },
                { val: 1, label: '1' },
                { val: 2, label: '2' },
                { val: 3, label: '3 o más' },
              ].map((opt) => {
                const isSelected = data.childrenCount === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    id={`children-btn-${opt.val}`}
                    onClick={() => {
                      onChange({
                        childrenCount: opt.val,
                        childrenAges: opt.val === 0 ? '' : data.childrenAges,
                      });
                    }}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-bold border transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/25 ring-2 ring-red-400/30'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-2xs'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lógica condicional: Si hijos > 0, mostrar campo para indicar las Edades de los hijos */}
          {data.childrenCount > 0 && (
            <div className="pt-3 border-t border-slate-200 space-y-2 animate-fadeIn">
              <label htmlFor="childrenAges" className="block text-sm font-semibold text-slate-800">
                Edades de los hijos <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="childrenAges"
                name="childrenAges"
                value={data.childrenAges}
                onChange={(e) => onChange({ childrenAges: e.target.value })}
                placeholder="Ej. 3 y 6 años / 8 meses"
                className={`w-full min-h-[48px] px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all shadow-2xs ${
                  errors.childrenAges
                    ? 'border-red-500 focus:ring-red-500/30'
                    : 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
                }`}
              />
              {errors.childrenAges && <p className="text-xs text-red-600 font-medium">{errors.childrenAges}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
