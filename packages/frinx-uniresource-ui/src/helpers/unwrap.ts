export default function unwrap<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new Error(`value is of type ${typeof value}`);
  }
  return value;
}
