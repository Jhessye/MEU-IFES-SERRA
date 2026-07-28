from dataclasses import dataclass, field
from uuid import UUID, uuid4
from typing import Optional, Dict, Any


@dataclass
class Edital:
	id: UUID = field(default_factory=uuid4)
	titulo: Optional[str] = None
	link: Optional[str] = None
	texto: Optional[str] = None

	def to_dict(self) -> Dict[str, Any]:
		return {
			"id": str(self.id),
			"titulo": self.titulo,
			"link": self.link,
			"texto": self.texto,
		}

	@classmethod
	def from_dict(cls, data: Dict[str, Any]) -> "Edital":
		id_val = data.get("id")
		id_obj = UUID(id_val) if id_val else uuid4()
		return cls(
			id=id_obj,
			titulo=data.get("titulo"),
			link=data.get("link"),
			texto=data.get("texto"),
		)

	# getters and setters
	def get_id(self) -> UUID:
		return self.id

	def set_id(self, value: UUID) -> None:
		self.id = value

	def get_titulo(self) -> Optional[str]:
		return self.titulo

	def set_titulo(self, value: str) -> None:
		self.titulo = value

	def get_link(self) -> Optional[str]:
		return self.link

	def set_link(self, value: str) -> None:
		self.link = value

	def get_texto(self) -> Optional[str]:
		return self.texto

	def set_texto(self, value: str) -> None:
		self.texto = value

