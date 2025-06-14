import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Container,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";

// Tema com esquema de cores azul
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // Azul principal
      dark: "#303f9f",
      light: "#7986cb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057", // Cor de contraste para ações específicas
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f5f7ff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 4,
        },
        containedPrimary: {
          boxShadow: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        },
      },
    },
});

const API_BASE_URL = {
  usuarios: "http://localhost/api/usuarios",
  salas: "http://localhost/api/salas",
  reservas: "http://localhost/api/reservas",
};

export default function App() {
  // Estados para armazenar dados da API
  const [usuarios, setUsuarios] = useState([]);
  const [salas, setSalas] = useState([]);
  const [reservas, setReservas] = useState([]);

  // Estados para formulários
  const [usuarioForm, setUsuarioForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    endereco: {
      cidade: "",
      estado: "",
      cep: "",
      rua: "",
    },
  });
  
  const [salaForm, setSalaForm] = useState({ 
    nome: "", 
    capacidade: 0 
  });
  
  const [reservaForm, setReservaForm] = useState({
    usuarioId: "",
    salaId: "",
    dataHora: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Carregar dados quando o componente é montado
  useEffect(() => {
    fetchUsuarios();
    fetchSalas();
    fetchReservas();
  }, []);

  // Funções para buscar dados da API
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE_URL.usuarios);
      setUsuarios(res.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      showNotification("Erro ao buscar usuários", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE_URL.salas);
      setSalas(res.data);
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
      showNotification("Erro ao buscar salas", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE_URL.reservas);
      setReservas(res.data);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      showNotification("Erro ao buscar reservas", "error");
    } finally {
      setLoading(false);
    }
  };

  // Funções para lidar com mudanças nos formulários
  const handleUsuarioChange = (e) => {
    const { name, value } = e.target;
    setUsuarioForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setUsuarioForm((prev) => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value,
      },
    }));
  };

  const handleSalaChange = (e) => {
    const { name, value } = e.target;
    setSalaForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReservaChange = (e) => {
    const { name, value } = e.target;
    setReservaForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Funções para limpar formulários
  const clearUsuarioForm = () => {
    setUsuarioForm({
      nome: "",
      email: "",
      cpf: "",
      dataNascimento: "",
      endereco: {
        cidade: "",
        estado: "",
        cep: "",
        rua: "",
      },
    });
  };

  const clearSalaForm = () => {
    setSalaForm({ nome: "", capacidade: 0 });
  };

  const clearReservaForm = () => {
    setReservaForm({ usuarioId: "", salaId: "", dataHora: "" });
  };

  // Notificações
  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Funções de submissão de formulários
  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ajustando o formato do payload para corresponder ao esperado pelo backend
      const payload = {
        nome: usuarioForm.nome,
        email: usuarioForm.email,
        cpf: usuarioForm.cpf || "",
        dataNascimento: usuarioForm.dataNascimento || "",
        endereco: {
          cidade: usuarioForm.endereco.cidade || "",
          estado: usuarioForm.endereco.estado || "",
          cep: usuarioForm.endereco.cep || "",
          rua: usuarioForm.endereco.rua || "",
        },
      };
      
      console.log("Enviando payload:", payload);
      await axios.post(API_BASE_URL.usuarios, payload);
      showNotification("Usuário cadastrado com sucesso!");
      fetchUsuarios();
      clearUsuarioForm();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      showNotification(
        `Erro ao criar usuário: ${error.response?.data?.message || error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSala = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simplificando o formato do payload para salas
      const payload = {
        nome: salaForm.nome,
        capacidade: parseInt(salaForm.capacidade, 10),
      };
      
      console.log("Enviando payload sala:", payload);
      await axios.post(API_BASE_URL.salas, payload);
      showNotification("Sala cadastrada com sucesso!");
      fetchSalas();
      clearSalaForm();
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      showNotification(
        `Erro ao criar sala: ${error.response?.data?.message || error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReserva = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_BASE_URL.reservas, {
        usuarioId: reservaForm.usuarioId,
        salaId: reservaForm.salaId,
        dataHora: reservaForm.dataHora,
      });
      showNotification("Reserva criada com sucesso!");
      fetchReservas();
      clearReservaForm();
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      showNotification("Erro ao criar reserva", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: "#f5f7ff", minHeight: "100vh", pb: 4 }}>
        {/* Barra de navegação */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <MeetingRoomIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de Gerenciamento de Salas
            </Typography>
            <Button 
              color="inherit" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                fetchUsuarios();
                fetchSalas();
                fetchReservas();
              }}
            >
              Atualizar
            </Button>
          </Toolbar>
        </AppBar>

        {/* Conteúdo principal */}
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {/* Notificações */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              sx={{ width: "100%" }}
            >
              {notification.message}
            </Alert>
          </Snackbar>

          {/* Seção de Usuários */}
          <Paper sx={{ mb: 3, overflow: 'hidden' }}>
            <Accordion defaultExpanded>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Usuários</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Formulário de cadastro de usuários */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Cadastrar Usuário
                    </Typography>
                    <form onSubmit={handleSubmitUsuario}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Nome"
                            name="nome"
                            value={usuarioForm.nome}
                            onChange={handleUsuarioChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Email"
                            name="email"
                            type="email"
                            value={usuarioForm.email}
                            onChange={handleUsuarioChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="CPF"
                            name="cpf"
                            value={usuarioForm.cpf}
                            onChange={handleUsuarioChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Data de Nascimento"
                            name="dataNascimento"
                            type="date"
                            value={usuarioForm.dataNascimento}
                            onChange={handleUsuarioChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Cidade"
                            name="cidade"
                            value={usuarioForm.endereco.cidade}
                            onChange={handleEnderecoChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Estado"
                            name="estado"
                            value={usuarioForm.endereco.estado}
                            onChange={handleEnderecoChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="CEP"
                            name="cep"
                            value={usuarioForm.endereco.cep}
                            onChange={handleEnderecoChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Rua"
                            name="rua"
                            value={usuarioForm.endereco.rua}
                            onChange={handleEnderecoChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<AddIcon />}
                              disabled={loading}
                            >
                              {loading ? <CircularProgress size={24} /> : "Cadastrar Usuário"}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                  
                  {/* Tabela de usuários */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Usuários Cadastrados
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : usuarios.length > 0 ? (
                      <Box sx={{ overflowX: "auto" }}>
                        <Table size="small">
                          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>CPF</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Data Nascimento</TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>Endereço</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {usuarios.map((usuario) => (
                              <TableRow key={usuario.id} hover>
                                <TableCell>{usuario.id}</TableCell>
                                <TableCell>{usuario.nome}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>{usuario.cpf || "-"}</TableCell>
                                <TableCell>
                                  {usuario.dataNascimento
                                    ? new Date(usuario.dataNascimento).toLocaleDateString()
                                    : "-"}
                                </TableCell>
                                <TableCell>
                                  {usuario.endereco?.cidade && usuario.endereco?.estado
                                    ? `${usuario.endereco.cidade}/${usuario.endereco.estado}`
                                    : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <Typography color="textSecondary">
                          Nenhum usuário cadastrado.
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
          
          {/* Seção de Salas */}
          <Paper sx={{ mb: 3, overflow: 'hidden' }}>
            <Accordion defaultExpanded>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MeetingRoomIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Salas</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Formulário de cadastro de salas */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Cadastrar Sala
                    </Typography>
                    <form onSubmit={handleSubmitSala}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Nome da Sala"
                            name="nome"
                            value={salaForm.nome}
                            onChange={handleSalaChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Capacidade"
                            name="capacidade"
                            type="number"
                            value={salaForm.capacidade}
                            onChange={handleSalaChange}
                            required
                            InputProps={{ inputProps: { min: 1 } }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<AddIcon />}
                              disabled={loading}
                            >
                              {loading ? <CircularProgress size={24} /> : "Cadastrar Sala"}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                  
                  {/* Tabela de salas */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Salas Cadastradas
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : salas.length > 0 ? (
                      <Table size="small">
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Capacidade</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {salas.map((sala) => (
                            <TableRow key={sala.id} hover>
                              <TableCell>{sala.id}</TableCell>
                              <TableCell>{sala.nome}</TableCell>
                              <TableCell>{sala.capacidade}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <Typography color="textSecondary">
                          Nenhuma sala cadastrada.
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
          
          {/* Seção de Reservas */}
          <Paper sx={{ mb: 3, overflow: 'hidden' }}>
            <Accordion defaultExpanded>
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Reservas</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* Formulário de cadastro de reservas */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Cadastrar Reserva
                    </Typography>
                    <form onSubmit={handleSubmitReserva}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            select
                            size="small"
                            label="Usuário"
                            name="usuarioId"
                            value={reservaForm.usuarioId}
                            onChange={handleReservaChange}
                            required
                          >
                            {usuarios.length > 0 ? (
                              usuarios.map((usuario) => (
                                <MenuItem key={usuario.id} value={usuario.id}>
                                  {usuario.nome}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>Nenhum usuário cadastrado</MenuItem>
                            )}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            select
                            size="small"
                            label="Sala"
                            name="salaId"
                            value={reservaForm.salaId}
                            onChange={handleReservaChange}
                            required
                          >
                            {salas.length > 0 ? (
                              salas.map((sala) => (
                                <MenuItem key={sala.id} value={sala.id}>
                                  {sala.nome} (Cap: {sala.capacidade})
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>Nenhuma sala cadastrada</MenuItem>
                            )}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Data e Hora"
                            name="dataHora"
                            type="datetime-local"
                            value={reservaForm.dataHora}
                            onChange={handleReservaChange}
                            required
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<AddIcon />}
                              disabled={loading}
                            >
                              {loading ? <CircularProgress size={24} /> : "Cadastrar Reserva"}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                  
                  {/* Tabela de reservas */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                      Reservas Cadastradas
                    </Typography>
                    {loading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : reservas.length > 0 ? (
                      <Table size="small">
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Usuário</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Sala</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Data e Hora</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reservas.map((reserva) => {
                            const usuario = usuarios.find(u => u.id === reserva.usuarioId);
                            const sala = salas.find(s => s.id === reserva.salaId);
                            
                            return (
                              <TableRow key={reserva.id} hover>
                                <TableCell>{reserva.id}</TableCell>
                                <TableCell>
                                  {usuario ? usuario.nome : reserva.usuarioId}
                                </TableCell>
                                <TableCell>
                                  {sala ? sala.nome : reserva.salaId}
                                </TableCell>
                                <TableCell>
                                  {new Date(reserva.dataHora).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <Typography color="textSecondary">
                          Nenhuma reserva cadastrada.
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
