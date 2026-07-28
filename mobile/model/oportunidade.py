from dataclasses import dataclass, field
from uuid import UUID, uuid4
from typing import Optional, Dict, Any


@dataclass
class Oportunidade:
	id: UUID = field(default_factory=uuid4)
	titulo: Optional[str] = None
	cargaHoraria: Optional[str] = None
	requisitos: Optional[str] = None
	observacoes: Optional[str] = None

	def to_dict(self) -> Dict[str, Any]:
		return {
			"id": str(self.id),
			"titulo": self.titulo,
			"cargaHoraria": self.cargaHoraria,
			"requisitos": self.requisitos,
			"observacoes": self.observacoes,
		}

	@classmethod
	def from_dict(cls, data: Dict[str, Any]) -> "Oportunidade":
		id_val = data.get("id")
		id_obj = UUID(id_val) if id_val else uuid4()
		return cls(
			id=id_obj,
			titulo=data.get("titulo"),
			cargaHoraria=data.get("cargaHoraria"),
			requisitos=data.get("requisitos"),
			observacoes=data.get("observacoes"),
		)

	def get_id(self) -> UUID:
		return self.id

	def set_id(self, value: UUID) -> None:
		self.id = value

	def get_titulo(self) -> Optional[str]:
		return self.titulo

	def set_titulo(self, value: str) -> None:
		self.titulo = value

	def get_cargaHoraria(self) -> Optional[str]:
		return self.cargaHoraria

	def set_cargaHoraria(self, value: str) -> None:
		self.cargaHoraria = value

	def get_requisitos(self) -> Optional[str]:
		return self.requisitos

	def set_requisitos(self, value: str) -> None:
		self.requisitos = value

	def get_observacoes(self) -> Optional[str]:
		return self.observacoes

	def set_observacoes(self, value: str) -> None:
		self.observacoes = value

