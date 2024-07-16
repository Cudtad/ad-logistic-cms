export const generateAvatar = (name?: string) => {
  return name ? name.split("")[0].toUpperCase() : "A";
};
export function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  // Lặp qua 6 ký tự để tạo mã màu hex
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * 16);
    color += letters[randomIndex];
  }

  return color;
}
export function generateRandomPassword() {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";

  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
