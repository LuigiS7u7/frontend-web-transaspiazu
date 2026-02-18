const formatearPlaca = (valor) => {
  if (!valor) return null;

  // Quitar todo menos letras y números
  const limpio = valor.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // Validar largo mínimo
  if (limpio.length < 7) return null;

  const letras = limpio.slice(0, 3);
  const numeros = limpio.slice(3, 7);

  // Validar estructura
  if (!/^[A-Z]{3}$/.test(letras)) return null;
  if (!/^[0-9]{4}$/.test(numeros)) return null;

  return `${letras}-${numeros}`;
};
