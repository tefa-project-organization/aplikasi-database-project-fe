import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
        contract_value: "",
        started_at: "",
        finished_at: "",
    })

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
        if (!initialData) return

        const clientId = initialData.client_id
            ? String(initialData.client_id)
            : ""

        const isValidClient = clientOptions.some(
            (c) => String(c.id) === clientId
        )

        setForm({
            project_name: initialData.project_name || "",
            project_type: initialData.project_type
                ? String(initialData.project_type)
                : "",
            client_id: isValidClient ? clientId : "",
            description: initialData.description || "",
            contract_value: initialData.contract_value || "",
            started_at: initialData.started_at?.split("T")[0] || "",
            finished_at: initialData.finished_at?.split("T")[0] || "",
        })
    }, [initialData, clientOptions])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        if (!form.project_name.trim() || !form.project_type || !form.client_id) {
            alert("Nama Proyek, Tipe Proyek, dan Client wajib diisi")
            return
        }

        // Helper aman untuk konversi tanggal ke ISO, null jika invalid/empty
        const parseDate = (dateStr) => {
            if (!dateStr) return null
            const d = new Date(dateStr)
            return isNaN(d.getTime()) ? null : d.toISOString()
        }

        // Payload sesuai ekspektasi backend
        const payload = {
            project_name: form.project_name.trim(),           // string
            project_type: String(form.project_type),         // string
            client_id: parseInt(form.client_id) || 0,        // integer
            description: String(form.description || ""),     // string
            contract_value: String(form.contract_value || ""), // string
            started_at: parseDate(form.started_at),          // ISO string / null
            finished_at: parseDate(form.finished_at),        // ISO string / null
        }

        console.log("Payload dikirim ke backend:", payload) // debug

        onSubmit?.(payload)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md bg-card text-card-foreground rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto px-4 py-4 scrollbar-none [&::-webkit-scrollbar]:hidden">
                <DialogHeader>
                    <DialogTitle>
                        {initialData && initialData.project_name ? "Edit Proyek" : "Tambah Proyek Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Perbarui informasi proyek"
                            : "Isi data proyek baru"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 mt-2">
                    {/* Nama Proyek */}
                    <div>
                        <label className="block mb-1 font-medium">Nama Proyek *</label>
                        <Input
                            name="project_name"
                            value={form.project_name}
                            onChange={handleChange}
                            placeholder="Masukkan nama proyek"
                            readOnly={readOnly}
                        />
                    </div>

                    {/* Tipe Proyek */}
                    <div>
                        <label className="block mb-1 font-medium">Tipe Proyek *</label>
                        <Select
                            value={form.project_type}
                            onValueChange={(val) =>
                                setForm((prev) => ({ ...prev, project_type: val }))
                            }
                            disabled={readOnly}
                        >
                            <SelectTrigger className="w-full">
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
                    </div>

                    {/* Client */}
                    <div>
                        <label className="block mb-1 font-medium">Client *</label>
                        <Select
                            value={form.client_id}
                            onValueChange={(val) =>
                                setForm((prev) => ({ ...prev, client_id: val }))
                            }
                            disabled={readOnly}
                        >
                            <SelectTrigger className="w-full">
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
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        client_id: String(client.id),
                                                    }))
                                                }
                                            >
                                                {client.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </SelectContent>
                        </Select>
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

                    {/* Nilai Kontrak */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Nilai Kontrak (Rp)
                        </label>
                        <Input
                            name="contract_value"
                            value={form.contract_value}
                            onChange={handleChange}
                            type="number"
                            placeholder="Masukkan nilai kontrak"
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
                        />
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
                        />
                    </div>

                    {!readOnly && (
                        <div className="flex justify-end space-x-2 mt-4">
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
                                disabled={submitting}
                            >
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
