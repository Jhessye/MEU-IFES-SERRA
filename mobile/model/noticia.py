from dataclasses import dataclass, field
from uuid import UUID, uuid4
from typing import Optional, Dict, Any
from datetime import datetime


@dataclass
class Noticia:
	id: UUID = field(default_factory=uuid4)
	titulo: Optional[str] = None
	autor: Optional[str] = None
	data: Optional[datetime] = None
	texto: Optional[str] = None
	imagem: Optional[str] = None

	def to_dict(self) -> Dict[str, Any]:
		return {
			"id": str(self.id),
			"titulo": self.titulo,
			"autor": self.autor,
			"data": self.data.isoformat() if self.data else None,
			"texto": self.texto,
			"imagem": self.imagem,
		}

	@classmethod
	def from_dict(cls, data: Dict[str, Any]) -> "Noticia":
		id_val = data.get("id")
		id_obj = UUID(id_val) if id_val else uuid4()
		date_val = data.get("data")
		date_obj = datetime.fromisoformat(date_val) if date_val else None
		return cls(
			id=id_obj,
			titulo=data.get("titulo"),
			autor=data.get("autor"),
			data=date_obj,
			texto=data.get("texto"),
			imagem=data.get("imagem"),
		)

	def get_id(self) -> UUID:
		return self.id

	def set_id(self, value: UUID) -> None:
		self.id = value

	def get_titulo(self) -> Optional[str]:
		return self.titulo

	def set_titulo(self, value: str) -> None:
		self.titulo = value

	def get_autor(self) -> Optional[str]:
		return self.autor

	def set_autor(self, value: str) -> None:
		self.autor = value

	def get_data(self) -> Optional[datetime]:
		return self.data

	def set_data(self, value: datetime) -> None:
		self.data = value

	def get_texto(self) -> Optional[str]:
		return self.texto

	def set_texto(self, value: str) -> None:
		self.texto = value

	def get_imagem(self) -> Optional[str]:
		return self.imagem

	def set_imagem(self, value: str) -> None:
		self.imagem = value

