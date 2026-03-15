import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Copy, Mail, Power, RefreshCw, KeyRound, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const SPECIALS = "!@#$%^&*()-_=+[]{};:,.?/|~";
const NUMBERS = "0123456789";
const UPPERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERS = "abcdefghijklmnopqrstuvwxyz";

function secureRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function pickRandom(chars) {
  return chars[secureRandomInt(chars.length)];
}

function shuffle(text) {
  const arr = [...text];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function generateRandomPassword({ length = 25, useSpecial = true, useNumbers = true, useUpper = true }) {
  let pool = LOWERS;
  const required = [pickRandom(LOWERS)];

  if (useSpecial) {
    pool += SPECIALS;
    required.push(pickRandom(SPECIALS));
  }
  if (useNumbers) {
    pool += NUMBERS;
    required.push(pickRandom(NUMBERS));
  }
  if (useUpper) {
    pool += UPPERS;
    required.push(pickRandom(UPPERS));
  }

  while (required.length < length) {
    required.push(pickRandom(pool));
  }

  return shuffle(required.slice(0, length).join(""));
}

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim();
}

function generatePasswordFromPhrase(phrase) {
  const cleaned = normalizeText(phrase);
  if (!cleaned) return "";

  const words = cleaned.split(/\s+/).filter(Boolean);
  const initials = words.map((w) => w[0]?.toUpperCase() || "").join("");
  const core = words
    .map((w, index) => {
      const first = w[0]?.toUpperCase() || "";
      const tail = w.slice(1, Math.min(4, w.length)).toLowerCase();
      return index % 2 === 0 ? `${first}${tail}` : `${first}${tail.split("").reverse().join("")}`;
    })
    .join("");

  const numberSeed = String(
    words.reduce((acc, w, idx) => acc + w.length * (idx + 3), 0) + phrase.length * 7
  ).slice(0, 4);

  const specialSeed = ["#", "@", "!", "&", "$", "%", "*", "+"][words.length % 8];
  const combined = `${initials}${specialSeed}${core}${numberSeed}`;
  return shuffle(combined).slice(0, Math.max(12, Math.min(25, combined.length)));
}

function passwordStrength(password) {
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 20) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Baja", tone: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30" };
  if (score <= 4) return { label: "Media", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" };
  return { label: "Alta", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" };
}

export default function GeneradorContrasenasPro() {
  const [theme, setTheme] = useState("dark");
  const [useSpecial, setUseSpecial] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [randomPassword, setRandomPassword] = useState("");
  const [phrase, setPhrase] = useState("");
  const [phrasePassword, setPhrasePassword] = useState("");
  const [toast, setToast] = useState("");
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("pwd-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("pwd-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    setRandomPassword(
      generateRandomPassword({
        length: 25,
        useSpecial,
        useNumbers,
        useUpper,
      })
    );
  }, [useSpecial, useNumbers, useUpper]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const randomStrength = useMemo(() => passwordStrength(randomPassword), [randomPassword]);
  const phraseStrength = useMemo(() => passwordStrength(phrasePassword), [phrasePassword]);

  const handleCopy = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setToast("Contraseña copiada al portapapeles");
    } catch {
      setToast("No se pudo copiar al portapapeles");
    }
  };

  const handleSendMail = (value, mode) => {
    if (!value) return;
    const subject = encodeURIComponent(`Contraseña generada - ${mode}`);
    const body = encodeURIComponent(`Hola,\n\nTe comparto la contraseña generada:\n\n${value}\n\nEnviado desde Generador de Contraseñas Pro.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleGenerateFromPhrase = () => {
    const generated = generatePasswordFromPhrase(phrase);
    setPhrasePassword(generated);
    setToast(generated ? "Contraseña creada desde la frase" : "Introduce una frase válida");
  };

  const handleFinalize = () => setClosed(true);
  const handleReopen = () => setClosed(false);

  if (closed) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "dark bg-slate-950" : "bg-slate-100"} flex items-center justify-center p-6`}>
        <Card className="w-full max-w-xl border-0 shadow-2xl rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur">
          <CardContent className="p-10 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <Power className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Aplicación finalizada</h2>
              <p className="text-slate-600 dark:text-slate-300">La sesión del generador se ha cerrado correctamente.</p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={handleReopen} className="rounded-2xl px-6">Reabrir</Button>
              <Button variant="outline" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-2xl px-6">
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Cambiar tema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 flex flex-col gap-5 rounded-[28px] border border-slate-200/70 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Generador de Contraseñas Pro</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Diseño moderno, seguro y listo para compartir.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Tema {theme === "dark" ? "claro" : "oscuro"}
              </Button>
              <Button variant="destructive" className="rounded-2xl" onClick={handleFinalize}>
                <Power className="mr-2 h-4 w-4" />
                Finalizar aplicación
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="rounded-[28px] border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <KeyRound className="h-6 w-6" />
                    Gestión de contraseñas
                  </CardTitle>
                  <CardDescription>
                    Genera claves aleatorias de 25 caracteres o crea una contraseña basada en una frase personal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="aleatoria" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12">
                      <TabsTrigger value="aleatoria" className="rounded-2xl">Contraseña aleatoria</TabsTrigger>
                      <TabsTrigger value="frase" className="rounded-2xl">Desde una frase</TabsTrigger>
                    </TabsList>

                    <TabsContent value="aleatoria" className="mt-6 space-y-6">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="specials" className="text-sm font-medium">Caracteres especiales</Label>
                            <Switch id="specials" checked={useSpecial} onCheckedChange={setUseSpecial} />
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="numbers" className="text-sm font-medium">Números</Label>
                            <Switch id="numbers" checked={useNumbers} onCheckedChange={setUseNumbers} />
                          </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="upper" className="text-sm font-medium">Mayúsculas</Label>
                            <Switch id="upper" checked={useUpper} onCheckedChange={setUseUpper} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Contraseña generada (25 caracteres)</Label>
                        <div className="flex flex-col gap-3 md:flex-row">
                          <Input value={randomPassword} readOnly className="h-14 rounded-2xl text-base font-mono tracking-wide" />
                          <Button className="h-14 rounded-2xl px-5" onClick={() => setRandomPassword(generateRandomPassword({ length: 25, useSpecial, useNumbers, useUpper }))}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Regenerar
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className={`rounded-xl px-3 py-1 border ${randomStrength.tone}`}>
                          Seguridad: {randomStrength.label}
                        </Badge>
                        <Badge variant="secondary" className="rounded-xl px-3 py-1">Longitud fija: 25</Badge>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button className="rounded-2xl" onClick={() => handleCopy(randomPassword)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar al portapapeles
                        </Button>
                        <Button variant="outline" className="rounded-2xl" onClick={() => handleSendMail(randomPassword, "aleatoria")}>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar por mail
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="frase" className="mt-6 space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="phrase">Introduce una frase</Label>
                        <Input
                          id="phrase"
                          placeholder="Ejemplo: Mi perro nació en Madrid en 2018"
                          value={phrase}
                          onChange={(e) => setPhrase(e.target.value)}
                          className="h-14 rounded-2xl text-base"
                        />
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          La aplicación transformará la frase en una contraseña más difícil de adivinar.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button className="rounded-2xl" onClick={handleGenerateFromPhrase}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generar desde frase
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <Label>Contraseña creada</Label>
                        <Input value={phrasePassword} readOnly className="h-14 rounded-2xl text-base font-mono tracking-wide" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className={`rounded-xl px-3 py-1 border ${phraseStrength.tone}`}>
                          Seguridad: {phrasePassword ? phraseStrength.label : "Pendiente"}
                        </Badge>
                        <Badge variant="secondary" className="rounded-xl px-3 py-1">Basada en frase personal</Badge>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button className="rounded-2xl" onClick={() => handleCopy(phrasePassword)} disabled={!phrasePassword}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar al portapapeles
                        </Button>
                        <Button variant="outline" className="rounded-2xl" onClick={() => handleSendMail(phrasePassword, "desde frase")} disabled={!phrasePassword}>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar por mail
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
              <Card className="rounded-[28px] border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Resumen de funciones</CardTitle>
                  <CardDescription>Incluye todo lo solicitado para un uso rápido y profesional.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white">Pestaña 1</p>
                    <p>Generación automática de contraseñas de 25 caracteres con opciones de mayúsculas, números y símbolos.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white">Pestaña 2</p>
                    <p>Conversión de una frase en una contraseña compacta y más segura.</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <p className="font-semibold text-slate-900 dark:text-white">Acciones rápidas</p>
                    <p>Copiar al portapapeles, abrir el cliente de correo para enviar la clave y finalizar la aplicación.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Consejos de seguridad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p>Evita reutilizar la misma contraseña en varios servicios.</p>
                  <p>Usa el envío por correo con precaución si la contraseña es sensible.</p>
                  <p>Guarda tus credenciales en un gestor de contraseñas siempre que sea posible.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-5 right-5 z-50">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-xl dark:border-slate-800 dark:bg-slate-900">
              {toast}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
