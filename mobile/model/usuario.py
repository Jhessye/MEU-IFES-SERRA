from dataclasses import dataclass, field
from uuid import UUID, uuid4
from typing import Optional, Dict, Any


@dataclass
class Usuario:
	id: UUID = field(default_factory=uuid4)
	recebeNotificacaoNoticia: bool = False
	recebeNotificacaoEdital: bool = False
	recebeNotificacaoOportunidade: bool = False

	def to_dict(self) -> Dict[str, Any]:
		return {
			"id": str(self.id),
			"recebeNotificacaoNoticia": self.recebeNotificacaoNoticia,
			"recebeNotificacaoEdital": self.recebeNotificacaoEdital,
			"recebeNotificacaoOportunidade": self.recebeNotificacaoOportunidade,
		}

	@classmethod
	def from_dict(cls, data: Dict[str, Any]) -> "Usuario":
		id_val = data.get("id")
		id_obj = UUID(id_val) if id_val else uuid4()
		return cls(
			id=id_obj,
			recebeNotificacaoNoticia=bool(data.get("recebeNotificacaoNoticia", False)),
			recebeNotificacaoEdital=bool(data.get("recebeNotificacaoEdital", False)),
			recebeNotificacaoOportunidade=bool(data.get("recebeNotificacaoOportunidade", False)),
		)

	def get_id(self) -> UUID:
		return self.id

	def set_id(self, value: UUID) -> None:
		self.id = value

	def get_recebeNotificacaoNoticia(self) -> bool:
		return self.recebeNotificacaoNoticia

	def set_recebeNotificacaoNoticia(self, value: bool) -> None:
		self.recebeNotificacaoNoticia = value

	def get_recebeNotificacaoEdital(self) -> bool:
		return self.recebeNotificacaoEdital

	def set_recebeNotificacaoEdital(self, value: bool) -> None:
		self.recebeNotificacaoEdital = value

	def get_recebeNotificacaoOportunidade(self) -> bool:
		return self.recebeNotificacaoOportunidade

	def set_recebeNotificacaoOportunidade(self, value: bool) -> None:
		self.recebeNotificacaoOportunidade = value

