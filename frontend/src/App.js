import React, { useState, useEffect, useCallback } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import TableViewIcon from "@mui/icons-material/TableView";

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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        },
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

  // Estados para os modais
  const [usuarioModalOpen, setUsuarioModalOpen] = useState(false);
  const [salaModalOpen, setSalaModalOpen] = useState(false);
  const [reservaModalOpen, setReservaModalOpen] = useState(false);
  const [buscaCpfModalOpen, setBuscaCpfModalOpen] = useState(false);

  // Estados para formulários
  const [form, setForm] = useState({
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
  const [salaForm, setSalaForm] = useState({ nome: "", capacidade: 0 });
  const [reservaForm, setReservaForm] = useState({
    usuarioId: "",
    salaId: "",
    dataHora: "",
  });
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Carregar dados quando o componente é montado
  useEffect(() => {
    fetchData("salas", setSalas);
    fetchData("reservas", setReservas);
    fetchData("usuarios", setUsuarios);
    // eslint-disable-next-line
  }, []);

  // Funções para buscar dados da API
  const fetchData = async (endpoint, setter) => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE_URL[endpoint]);
      console.log(`Dados de ${endpoint} carregados com sucesso:`, res.data);
      setter(res.data);
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error);
      showNotification(`Erro ao buscar ${endpoint}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Funções de manipulação de formulários com useCallback para evitar re-renders desnecessários
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }, []);

  const handleEnderecoChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      endereco: {
        ...prevForm.endereco,
        [name]: value,
      },
    }));
  }, []);

  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Limpar formulários
  const clearForm = () => {
    setForm({
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

  // Submissões de formulários
  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        cpf: form.cpf || null,
        dataNascimento: form.dataNascimento || null,
        endereco: {
          cidade: form.endereco.cidade || null,
          estado: form.endereco.estado || null,
          cep: form.endereco.cep || null,
          rua: form.endereco.rua || null,
        },
      };
      console.log("Enviando payload:", payload);
      await axios.post(API_BASE_URL.usuarios, payload);
      showNotification("Usuário criado com sucesso!");
      fetchData("usuarios", setUsuarios);
      clearForm();
      setUsuarioModalOpen(false);
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
    e.stopPropagation();
    setLoading(true);
    try {
      // Criar o objeto no formato esperado pelo backend
      const payload = {
        nome: {
          nome: salaForm.nome,
        },
        capacidade: {
          capacidade: parseInt(salaForm.capacidade, 10),
        },
      };
      console.log("Enviando payload sala:", payload);
      await axios.post(API_BASE_URL.salas, payload);
      showNotification("Sala criada com sucesso!");
      fetchData("salas", setSalas);
      clearSalaForm();
      setSalaModalOpen(false);
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
      fetchData("reservas", setReservas);
      clearReservaForm();
      setReservaModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      showNotification("Erro ao criar reserva", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarPorCpf = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL.usuarios}/${cpf}`);
      if (response.data) {
        showNotification(
          `Usuário encontrado: ${response.data.nome}`,
          "success"
        );
      } else {
        showNotification("Usuário não encontrado!", "warning");
      }
    } catch (error) {
      console.error("Erro ao buscar usuário por CPF:", error);
      showNotification("Erro ao buscar usuário", "error");
    } finally {
      setLoading(false);
      setCpf("");
      setBuscaCpfModalOpen(false);
    }
  };

  // Manipuladores para evitar eventos de propagação e fechamento indevido dos modais
  const handleCardClick = useCallback((setModalOpen) => {
    return (e) => {
      e.stopPropagation();
      setModalOpen(true);
    };
  }, []);

  const handleModalClose = useCallback((setModalState, clearFn) => {
    return () => {
      if (clearFn) clearFn();
      setModalState(false);
    };
  }, []);

  // Componente de modal modificado para evitar o problema de "piscar"
  const ModalDialog = ({ open, onClose, title, icon, children }) => (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      onClick={(e) => e.stopPropagation()}
      disableEscapeKeyDown
      hideBackdrop={false}
      keepMounted
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {icon}
        <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }} onClick={(e) => e.stopPropagation()}>
        {children}
      </DialogContent>
    </Dialog>
  );

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: "#f5f7ff", minHeight: "100vh" }}>
        {/* Barra de navegação */}
        <AppBar
          position="static"
          sx={{ bgcolor: theme.palette.primary.main }}
          elevation={0}
        >
          <Toolbar>
            <MeetingRoomIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de Gerenciamento de Salas e Reservas
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Container principal */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

          {/* Cards de ações principais */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card
                onClick={handleCardClick(setUsuarioModalOpen)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(63, 81, 181, 0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PersonAddIcon sx={{ mr: 1.5 }} />
                  <Typography variant="h6">Cadastrar Usuário</Typography>
                </Box>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Cadastre novos usuários no sistema com informações completas como
                    nome, email, CPF e endereço.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                onClick={handleCardClick(setSalaModalOpen)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(63, 81, 181, 0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MeetingRoomIcon sx={{ mr: 1.5 }} />
                  <Typography variant="h6">Cadastrar Sala</Typography>
                </Box>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Adicione novas salas definindo o nome e a capacidade máxima de
                    pessoas.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                onClick={handleCardClick(setReservaModalOpen)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(63, 81, 181, 0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <EventAvailableIcon sx={{ mr: 1.5 }} />
                  <Typography variant="h6">Criar Reserva</Typography>
                </Box>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Agende uma reserva selecionando o usuário, sala e horário desejado.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                onClick={handleCardClick(setBuscaCpfModalOpen)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(63, 81, 181, 0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <SearchIcon sx={{ mr: 1.5 }} />
                  <Typography variant="h6">Buscar Usuário por CPF</Typography>
                </Box>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    Localize um usuário específico usando o número de CPF.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Lista de reservas */}
          <Card>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "white",
                p: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <TableViewIcon sx={{ mr: 1.5 }} />
              <Typography variant="h6">Reservas Agendadas</Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 4,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : reservas.length > 0 ? (
                <Table>
                  <TableHead
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500 }}>Usuário</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Sala</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Data e Hora</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservas.map((reserva) => {
                      const usuario = usuarios.find(
                        (u) => u.id === reserva.usuarioId
                      );
                      const sala = salas.find(
                        (s) => s.id === reserva.salaId
                      );

                      return (
                        <TableRow
                          key={reserva.id}
                          sx={{
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            },
                          }}
                        >
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
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body1" color="textSecondary">
                    Nenhuma reserva encontrada.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Modal de Usuário */}
          <ModalDialog
            open={usuarioModalOpen}
            onClose={handleModalClose(setUsuarioModalOpen, clearForm)}
            title="Cadastrar Usuário"
            icon={<PersonAddIcon />}
          >
            <form
              onSubmit={handleSubmitUsuario}
              onClick={(e) => e.stopPropagation()}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    required
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    required
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="CPF"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    inputProps={{ maxLength: 14 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    name="dataNascimento"
                    type="date"
                    value={form.dataNascimento}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>

                {/* Seção de Endereço */}
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <HomeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="subtitle1">
                      Informações de Endereço
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    name="cidade"
                    value={form.endereco.cidade}
                    onChange={handleEnderecoChange}
                    variant="outlined"
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Estado"
                    name="estado"
                    value={form.endereco.estado}
                    onChange={handleEnderecoChange}
                    variant="outlined"
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="CEP"
                    name="cep"
                    value={form.endereco.cep}
                    onChange={handleEnderecoChange}
                    variant="outlined"
                    size="small"
                    inputProps={{ maxLength: 9 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rua"
                    name="rua"
                    value={form.endereco.rua}
                    onChange={handleEnderecoChange}
                    variant="outlined"
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
              </Grid>

              <DialogActions>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearForm();
                    setUsuarioModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<AddIcon />}
                  disabled={loading}
                  onClick={(e) => e.stopPropagation()}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Cadastrar Usuário"
                  )}
                </Button>
              </DialogActions>
            </form>
          </ModalDialog>

          {/* Modal de Sala */}
          <ModalDialog
            open={salaModalOpen}
            onClose={handleModalClose(setSalaModalOpen, clearSalaForm)}
            title="Cadastrar Sala"
            icon={<MeetingRoomIcon />}
          >
            <form
              onSubmit={handleSubmitSala}
              onClick={(e) => e.stopPropagation()}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Nome da Sala"
                    name="nome"
                    value={salaForm.nome}
                    onChange={(e) =>
                      setSalaForm({ ...salaForm, nome: e.target.value })
                    }
                    variant="outlined"
                    size="small"
                    required
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Capacidade"
                    name="capacidade"
                    type="number"
                    value={salaForm.capacidade}
                    onChange={(e) =>
                      setSalaForm({
                        ...salaForm,
                        capacidade: e.target.value,
                      })
                    }
                    variant="outlined"
                    size="small"
                    required
                    InputProps={{ inputProps: { min: 1 } }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: theme.palette.primary.main }}
                >
                  Salas Disponíveis
                </Typography>
                {salas.length > 0 ? (
                  <Table>
                    <TableHead
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      <TableRow>
                        <TableCell sx={{ fontWeight: 500 }}>Nome</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>Capacidade</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salas.map((sala) => (
                        <TableRow
                          key={sala.id}
                          sx={{
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            },
                          }}
                        >
                          <TableCell>{sala.nome}</TableCell>
                          <TableCell>{sala.capacidade}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      bgcolor: "#f9f9f9",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1" color="textSecondary">
                      Nenhuma sala cadastrada.
                    </Typography>
                  </Box>
                )}
              </Box>

              <DialogActions>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSalaForm();
                    setSalaModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<AddIcon />}
                  disabled={loading}
                  onClick={(e) => e.stopPropagation()}
                >
                  {loading ? <CircularProgress size={24} /> : "Cadastrar Sala"}
                </Button>
              </DialogActions>
            </form>
          </ModalDialog>

          {/* Modal de Reserva */}
          <ModalDialog
            open={reservaModalOpen}
            onClose={handleModalClose(setReservaModalOpen, clearReservaForm)}
            title="Criar Reserva"
            icon={<EventAvailableIcon />}
          >
            <form
              onSubmit={handleSubmitReserva}
              onClick={(e) => e.stopPropagation()}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Usuário"
                    name="usuarioId"
                    value={reservaForm.usuarioId}
                    onChange={(e) =>
                      setReservaForm({
                        ...reservaForm,
                        usuarioId: e.target.value,
                      })
                    }
                    variant="outlined"
                    size="small"
                    required
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 },
                      },
                    }}
                  >
                    {usuarios.length > 0 ? (
                      usuarios.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.nome}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>Nenhum usuário cadastrado</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Sala"
                    name="salaId"
                    value={reservaForm.salaId}
                    onChange={(e) =>
                      setReservaForm({
                        ...reservaForm,
                        salaId: e.target.value,
                      })
                    }
                    variant="outlined"
                    size="small"
                    required
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 },
                      },
                    }}
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Data e Hora"
                    type="datetime-local"
                    name="dataHora"
                    value={reservaForm.dataHora}
                    onChange={(e) =>
                      setReservaForm({
                        ...reservaForm,
                        dataHora: e.target.value,
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    size="small"
                    required
                  />
                </Grid>
              </Grid>

              <DialogActions>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearReservaForm();
                    setReservaModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  onClick={(e) => e.stopPropagation()}
                >
                  {loading ? <CircularProgress size={24} /> : "Confirmar Reserva"}
                </Button>
              </DialogActions>
            </form>
          </ModalDialog>

          {/* Modal de Busca por CPF */}
          <ModalDialog
            open={buscaCpfModalOpen}
            onClose={handleModalClose(setBuscaCpfModalOpen)}
            title="Buscar Usuário por CPF"
            icon={<SearchIcon />}
          >
            <form
              onSubmit={handleBuscarPorCpf}
              onClick={(e) => e.stopPropagation()}
            >
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                variant="outlined"
                size="small"
                required
                sx={{ mb: 2 }}
              />

              <DialogActions>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCpf("");
                    setBuscaCpfModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<SearchIcon />}
                  disabled={loading}
                  onClick={(e) => e.stopPropagation()}
                >
                  {loading ? <CircularProgress size={24} /> : "Buscar Usuário"}
                </Button>
              </DialogActions>
            </form>
          </ModalDialog>
        </Container>
      </div>
    </ThemeProvider>
  );
}
