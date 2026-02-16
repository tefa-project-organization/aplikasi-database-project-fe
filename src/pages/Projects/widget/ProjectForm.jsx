import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DialogClose } from "@/components/ui/dialog"
import { X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {    
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "@/components/ui/select"
import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import api from "@/lib/api"
import { SHOW_ALL_PROJECTS } from "@/constants/api/project"
import * as Yup from "yup"
import { toast } from "sonner"

const projectSchema = Yup.object().shape({
    project_name: Yup.string().required("Nama proyek wajib diisi"),
    project_code: Yup.string().required("Kode proyek wajib diisi"),
    project_type: Yup.string().required("Tipe proyek wajib dipilih"),
    client_id: Yup.string().required("Client wajib dipilih"),
    description: Yup.string(),
    started_at: Yup.date().nullable(),
    finished_at: Yup.date().nullable().min(Yup.ref('started_at'), "Tanggal selesai harus setelah tanggal mulai"),
})

export default function ProjectForm({
    open,
    setOpen,
    onSubmit,
    initialData,
    clientOptions = [],
    readOnly = false,
    submitting = false,
}) {
    const [form, setForm] = useState({
        project_name: "",
        project_type: "",
        client_id: "",
        description: "",
        project_code: "",
        started_at: "",
        finished_at: "",
    })
    const [originalForm, setOriginalForm] = useState(null)
    const [errors, setErrors] = useState({})

    const [projectTypeOptions, setProjectTypeOptions] = useState([])

    /* FETCH PROJECT TYPE */
    useEffect(() => {
        fetchProjectTypes()
    }, [])

    const fetchProjectTypes = async () => {
        try {
            const res = await api.get(SHOW_ALL_PROJECTS)
            // Sesuaikan path ini dengan struktur respons API yang sebenarnya
            const projects = res?.data?.items || res?.data?.data?.items || []

            // Ekstrak nilai unik dari properti 'project_type'
            const uniqueTypes = [...new Set(
                projects
                    .map(p => p.project_type)
                    .filter(type => type != null && type !== '')
            )].map(type => ({
                // Atur formatnya agar sesuai dengan SelectItem
                project_type: type,
                project_type_name: type // atau format sesuai kebutuhan, misal: type.toUpperCase()
            }))

            setProjectTypeOptions(uniqueTypes)
        } catch (err) {
            console.error("Fetch project type error:", err)
            setProjectTypeOptions([])
        }
    }

    /* INIT EDIT DATA */
    useEffect(() => {
        if (!initialData) {
            // Reset form and errors when opening create mode
            setForm({
                project_name: "",
                project_type: "",
                client_id: "",
                description: "",
                project_code: "",
                started_at: "",
                finished_at: "",
            })
            setOriginalForm(null)
            setErrors({})
            return
        }

        const clientId = initialData.client_id
            ? String(initialData.client_id)
            : ""

        const isValidClient = clientOptions.some(
            (c) => String(c.id) === clientId
        )

        const initialFormData = {
            project_name: initialData.project_name || "",
            project_code: initialData.project_code || "",
            project_type: initialData.project_type
                ? String(initialData.project_type)
                : "",
            client_id: isValidClient ? clientId : "",
            description: initialData.description || "",
            started_at: initialData.started_at?.split("T")[0] || "",
            finished_at: initialData.finished_at?.split("T")[0] || "",
        }

        setForm(initialFormData)
        setOriginalForm(initialFormData)
        setErrors({})
    }, [initialData, clientOptions, open])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    const handleSelectChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }))
        }
    }

    const hasFormChanged = () => {
        if (!initialData || !originalForm) return true
        return JSON.stringify(form) !== JSON.stringify(originalForm)
    }

    const handleSubmit = async () => {
        try {
            await projectSchema.validate(form, { abortEarly: false })
            setErrors({})

            // Helper aman untuk konversi tanggal ke ISO, null jika invalid/empty
            const parseDate = (dateStr) => {
                if (!dateStr) return null
                const d = new Date(dateStr)
                return isNaN(d.getTime()) ? null : d.toISOString()
            }

            // Payload sesuai ekspektasi backend
            const payload = {
                project_name: form.project_name.trim(),
                project_code: form.project_code.trim(),
                project_type: String(form.project_type),
                client_id: parseInt(form.client_id) || 0,
                description: String(form.description || ""),
                started_at: parseDate(form.started_at),
                finished_at: parseDate(form.finished_at),
            }

            console.log("Payload dikirim ke backend:", payload)

            try {
                await onSubmit?.(payload)
                setOpen(false)
                toast.success(`Proyek berhasil ${initialData ? "diperbarui" : "ditambahkan"}`)
            } catch (error) {
                toast.error(error?.message || "Gagal menyimpan proyek")
            }
        } catch (validationError) {
            if (validationError.inner) {
                const newErrors = {}
                validationError.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setErrors(newErrors)
                toast.error("Semua field wajib diisi dengan benar")
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md h-[80vh] bg-card text-card-foreground rounded-2xl shadow-2xl flex flex-col p-0">
            <DialogHeader className="px-4 py-3 border-b sticky top-0 bg-card z-10 relative">
            <DialogTitle>
                {initialData && initialData.project_name
                ? "Edit Proyek"
                : "Tambah Proyek Baru"}
            </DialogTitle>

            <DialogDescription>
                {initialData ? "Perbarui informasi proyek" : "Isi data proyek baru"}
            </DialogDescription>

            {/* TOMBOL X */}
            <DialogClose asChild>
                <button
                className="absolute right-4 top-4 rounded-md opacity-70 hover:opacity-100"
                aria-label="Close"
                >
                <X className="h-4 w-4" />
                </button>
            </DialogClose>
            </DialogHeader>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {/* Nama Proyek */}
                    <div>
                        <label className="block mb-1 font-medium">Nama Proyek *</label>
                        <Input
                            name="project_name"
                            value={form.project_name}
                            onChange={handleChange}
                            placeholder="Masukkan nama proyek"
                            readOnly={readOnly}
                            className={errors.project_name ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.project_name && <p className="text-red-500 text-xs mt-1">{errors.project_name}</p>}
                    </div>

                     {/* Kode Proyek */}
                    <div>
                        <label className="block mb-1 font-medium">Kode Proyek *</label>
                        <Input
                            name="project_code"
                            value={form.project_code}
                            onChange={handleChange}
                            placeholder="Masukkan kode proyek"
                            readOnly={readOnly}
                            className={errors.project_code ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.project_code && <p className="text-red-500 text-xs mt-1">{errors.project_code}</p>}
                    </div>

                    {/* Tipe Proyek */}
                    <div>
                        <label className="block mb-1 font-medium">Tipe Proyek *</label>
                        <Select
                            value={form.project_type}
                            onValueChange={(val) => handleSelectChange("project_type", val)}
                            disabled={readOnly}
                        >
                            <SelectTrigger className={`w-full ${errors.project_type ? "border-red-500 focus:ring-red-500" : ""}`}>
                                <SelectValue placeholder="Pilih tipe proyek">
                                    {form.project_type &&
                                        projectTypeOptions.find(
                                            (p) =>
                                                String(p.project_type) === form.project_type
                                        )?.project_type_name}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent position="popper">
                                {projectTypeOptions.map((type) => (
                                    <SelectItem
                                        key={type.project_type}
                                        value={String(type.project_type)}
                                    >
                                        {type.project_type_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.project_type && <p className="text-red-500 text-xs mt-1">{errors.project_type}</p>}
                    </div>

                    {/* Client */}
                    <div>
                        <label className="block mb-1 font-medium">Client *</label>
                        <Select
                            value={form.client_id}
                            onValueChange={(val) => handleSelectChange("client_id", val)}
                            disabled={readOnly}
                        >
                            <SelectTrigger className={`w-full ${errors.client_id ? "border-red-500 focus:ring-red-500" : ""}`}>
                                <SelectValue placeholder="Pilih client">
                                    {form.client_id &&
                                        clientOptions.find(
                                            (c) => String(c.id) === form.client_id
                                        )?.name}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent position="popper">
                                <Command>
                                    <CommandInput placeholder="Cari client..." />
                                    <CommandEmpty>Tidak ada client</CommandEmpty>
                                    <CommandGroup>
                                        {clientOptions.map((client) => (
                                            <CommandItem
                                                key={client.id}
                                                onSelect={() =>
                                                    handleSelectChange("client_id", String(client.id))
                                                }
                                            >
                                                {client.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </SelectContent>
                        </Select>
                        {errors.client_id && <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block mb-1 font-medium">Deskripsi</label>
                        <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={2}
                            className="resize-none"
                            placeholder="Masukkan deskripsi proyek"
                            readOnly={readOnly}
                        />
                    </div>

                  

                    {/* Tanggal */}
                    <div>
                        <label className="block mb-1 font-medium">Tanggal Mulai</label>
                        <Input
                            name="started_at"
                            value={form.started_at}
                            onChange={handleChange}
                            type="date"
                            readOnly={readOnly}
                            className={errors.started_at ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.started_at && <p className="text-red-500 text-xs mt-1">{errors.started_at}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Tanggal Selesai
                        </label>
                        <Input
                            name="finished_at"
                            value={form.finished_at}
                            onChange={handleChange}
                            type="date"
                            readOnly={readOnly}
                            className={errors.finished_at ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {errors.finished_at && <p className="text-red-500 text-xs mt-1">{errors.finished_at}</p>}
                    </div>

                    
                </div>
                {!readOnly && (
                        <div className="px-4 py-3 border-t bg-card flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting || (initialData && !hasFormChanged())}
                                title={initialData && !hasFormChanged() ? "Tidak ada perubahan data" : ""}
                            >
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    )}
            </DialogContent>
        </Dialog>
    )
}
