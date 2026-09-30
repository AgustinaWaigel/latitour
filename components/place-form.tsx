'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Place,
  categories,
  labels,
  days,
  availabilityLabels,
} from '@/lib/types';
import { placeSchema, PlaceInput } from '@/lib/validation';
import { savePlace } from '@/app/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { NativeSelect } from './ui/native-select';
export function PlaceForm({ place }: { place?: Place }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlaceInput>({
    resolver: zodResolver(placeSchema),
    defaultValues: place || {
      name: '',
      description: '',
      category: 'gastronomia',
      address: '',
      latitude: -31.731,
      longitude: -60.53,
      image_url: '',
      phone: '',
      whatsapp: '',
      hours: days.map(() => ''),
      status: 'unknown',
      availability: 'ask',
    },
  });
  const err = (name: keyof PlaceInput) =>
    errors[name] && (
      <span className="field-error">{errors[name]?.message}</span>
    );
  return (
    <form
      className="place-form info-panel"
      onSubmit={handleSubmit(async (values) => {
        try {
          const result = await savePlace(values, place?.id);
          if (result.error) toast.error(result.error);
          else {
            toast.success(result.success);
            router.push('/panel');
            router.refresh();
          }
        } catch {
          toast.error(
            'No se pudo guardar. Revisá la conexión e intentá nuevamente.',
          );
        }
      })}
    >
      <h2>Información del lugar</h2>
      <div className="form-grid">
        <label>
          Nombre *<Input {...register('name')} />
          {err('name')}
        </label>
        <label>
          Categoría *
          <NativeSelect {...register('category')}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {labels[c]}
              </option>
            ))}
          </NativeSelect>
          {err('category')}
        </label>
      </div>
      <label>
        Descripción *<Textarea rows={4} {...register('description')} />
        {err('description')}
      </label>
      <label>
        Dirección *<Input {...register('address')} />
        {err('address')}
      </label>
      <div className="form-grid">
        <label>
          Latitud *
          <Input
            type="number"
            step="any"
            {...register('latitude', { valueAsNumber: true })}
          />
          {err('latitude')}
        </label>
        <label>
          Longitud *
          <Input
            type="number"
            step="any"
            {...register('longitude', { valueAsNumber: true })}
          />
          {err('longitude')}
        </label>
      </div>
      <label>
        URL de imagen (HTTPS)
        <Input type="url" placeholder="https://…" {...register('image_url')} />
        {err('image_url')}
      </label>
      <div className="form-grid">
        <label>
          Teléfono
          <Input type="tel" {...register('phone')} />
          {err('phone')}
        </label>
        <label>
          WhatsApp (código de país y número)
          <Input type="tel" placeholder="549343…" {...register('whatsapp')} />
          {err('whatsapp')}
        </label>
      </div>
      <h2 className="mt-8">Horarios habituales</h2>
      <p className="muted small">
        Ejemplo: 09:00–13:00 / 17:00–21:00, Cerrado o Con cita previa.
      </p>
      <div className="form-grid">
        {days.map((d, i) => (
          <label key={d}>
            {d}
            <Input
              maxLength={80}
              placeholder="Sin informar"
              {...register(`hours.${i}`)}
            />
          </label>
        ))}
      </div>
      <h2 className="mt-8">Estado y disponibilidad</h2>
      <div className="form-grid">
        <label>
          Estado declarado
          <NativeSelect {...register('status')}>
            <option value="unknown">Sin confirmar</option>
            <option value="open">Abierto</option>
            <option value="closed">Cerrado</option>
          </NativeSelect>
        </label>
        <label>
          Disponibilidad
          <NativeSelect {...register('availability')}>
            {Object.entries(availabilityLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </NativeSelect>
        </label>
      </div>
      <p className="muted small my-4">
        Cambiar el estado registra una nueva confirmación. Para reconfirmar el
        mismo estado, usá el botón del panel.
      </p>
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="field-error">
          Revisá los campos señalados antes de guardar.
        </p>
      )}
      <div className="flex gap-3 mt-6">
        <Button disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar establecimiento'}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/panel">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
