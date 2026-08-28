export interface Admin {
  id: string;
  username: string;
}

export interface Noticia {
  id?: string;
  titulo: string;
  link: string;
  autor: string;
  data: string;
  texto: string;
  imagem?: string;
}

export interface Edital {
  id?: string;
  titulo: string;
  link: string;
  pdf?: string;
  formulario?: string;
  texto: string;
}

export interface Oportunidade {
  id?: string;
  titulo: string;
  link_vaga: string;
  cargaHoraria?: string;
  requisitos?: string;
  observacoes?: string;
  dataFinalInscricao: string;
  diasInscricao?: number;
}